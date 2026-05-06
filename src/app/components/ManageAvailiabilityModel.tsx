
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { getData, postData } from '@/services/admin-services';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type SlotType = 'MORNING' | 'AFTERNOON' | 'BOTH';
type EntrySlot = 'MORNING' | 'AFTERNOON';

interface Agent {
  _id: string;
  name: string;
}

interface SlotEntry {
  id: string;
  date: Date;
  slotType: EntrySlot;
  agentId: string;
  savedId?: string;
}

function formatDisplayDate(date: Date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function toISODay(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
}

export default function ManageAvailabilityModal({ onClose, mutate }: { onClose: () => void, mutate: () => void }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [slotType, setSlotType] = useState<SlotType>('MORNING');
  const [entries, setEntries] = useState<SlotEntry[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getData('/api/audition/agents');
        setAgents(details.data?.data || []);
      } catch (error) {
        setAgents([]);
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchData();
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };


  const isDuplicateEntry = (date: Date, slot: EntrySlot, checkArray: SlotEntry[] = entries): boolean => {
    return checkArray.some(e => e.date.toDateString() === date.toDateString() && e.slotType === slot);
  };

  const handleAddEntries = () => {
    if (selectedDays.length === 0) return;

    const newEntries: SlotEntry[] = [];

    selectedDays.forEach(day => {
      const date = new Date(viewYear, viewMonth, day);

      const exists = (slot: EntrySlot) =>
        entries.some(e =>
          e.date.toDateString() === date.toDateString() &&
          e.slotType === slot
        );

      if (slotType === 'BOTH') {
        if (!exists('MORNING')) {
          newEntries.push({
            id: `${date.toISOString()}-MORNING-${Date.now()}`,
            date,
            slotType: 'MORNING',
            agentId: agents[0]?._id || ''
          });
        }

        if (!exists('AFTERNOON')) {
          newEntries.push({
            id: `${date.toISOString()}-AFTERNOON-${Date.now() + 1}`,
            date,
            slotType: 'AFTERNOON',
            agentId: agents[0]?._id || ''
          });
        }
      } else {
        if (!exists(slotType as EntrySlot)) {
          newEntries.push({
            id: `${date.toISOString()}-${slotType}-${Date.now()}`,
            date,
            slotType: slotType as EntrySlot,
            agentId: agents[0]?._id || ''
          });
        }
      }
    });

    if (newEntries.length > 0) {
      setEntries(prev => [...prev, ...newEntries]);
    }

    setSelectedDays([]);
  };

  const updateEntry = (id: string, field: 'slotType' | 'agentId', value: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value as EntrySlot } : e));
  };

  const deleteEntry = async (entry: SlotEntry) => {
    if (entry.savedId) {
      await fetch(`/api/audition/availability/${entry.savedId}`, { method: 'DELETE' }).catch(() => { });
    }
    setEntries(prev => prev.filter(e => e.id !== entry.id));
  };



  const handleSave = async () => {
    if (entries.length === 0) return;
    setSaving(true);

    const grouped: Record<string, { date: Date; MORNING: string[]; AFTERNOON: string[] }> = {};
    entries.forEach(e => {
      const key = e.date.toDateString();
      if (!grouped[key]) grouped[key] = { date: e.date, MORNING: [], AFTERNOON: [] };
      if (e.agentId) grouped[key][e.slotType].push(e.agentId);
    });

    const payload = Object.values(grouped).map(g => ({
      date: toISODay(g.date),
      selectedSlots: [
        ...(g.MORNING.length ? ['MORNING'] : []),
        ...(g.AFTERNOON.length ? ['AFTERNOON'] : []),
      ],
      slots: { MORNING: g.MORNING, AFTERNOON: g.AFTERNOON },
    }));

    try {
      await postData('/api/audition/availability', payload);
    } catch (e) { }
    setSaving(false);
    mutate();
    onClose();
  };

  const calendarCells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  function isPastDate(year: number, month: number, day: number) {
    const today = new Date();
    const checkDate = new Date(year, month, day);

    // remove time for accurate comparison
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < today;
  }
  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

  const dateGroups = Object.values(entries.reduce<Record<string, { date: Date; items: SlotEntry[] }>>((acc, entry) => {
    const key = entry.date.toDateString();
    if (!acc[key]) acc[key] = { date: entry.date, items: [] };
    acc[key].items.push(entry);
    return acc;
  }, {})).sort((a, b) => a.date.getTime() - b.date.getTime());


  const isEntryInvalid = (entry: SlotEntry) =>
    !entry.agentId || !entry.slotType;
const hasInvalidEntries = entries.some(isEntryInvalid);
  return (
    <div className='bg-black/60' style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150
    }}>
      <div className='overflow-y-auto overflo-custom' style={{
        marginTop: isMobile ? 80 : 70,
        width: isMobile ? 'calc(100vw - 20px)' : 'min(900px, 90vw)',
        maxHeight: isMobile ? 'calc(100vh - 10px)' : 'auto',
        borderRadius: 18,
        background: '#2b2426', padding: isMobile ? 12 : 10, boxSizing: 'border-box',
        overflowY: isMobile ? 'auto' : 'visible'
      }}>
        <h2 style={{ color: '#fff', fontSize: isMobile ? 18 : 20, fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Manage Availability
        </h2>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 18 }}>
          {/* LEFT: Calendar */}
          <div style={{ background: '#3a3235', borderRadius: 14, padding: isMobile ? 14 : 18, width: isMobile ? '100%' : 340, flexShrink: 0 }}>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <button onClick={() => { const d = new Date(viewYear, viewMonth - 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
                style={{ background: 'none', border: 'none', color: '#ccc', fontSize: 18, cursor: 'pointer' }}>‹</button>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{monthName}</span>
              <button onClick={() => { const d = new Date(viewYear, viewMonth + 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
                style={{ background: 'none', border: 'none', color: '#ccc', fontSize: 18, cursor: 'pointer' }}>›</button>
            </div>

            {/* Day labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 6 }}>
              {DAY_LABELS.map(d => (
                <div key={d} style={{ color: '#aaa', fontSize: 12, padding: '2px 0' }}>{d}</div>
              ))}
            </div>

            {/* Date cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
              {calendarCells.map((day, i) => {
                const isDisabled = !day || isPastDate(viewYear, viewMonth, day);
                return (

                  <button key={i} disabled={isDisabled}
                    onClick={() => day && toggleDay(day)}
                    style={{
                      height: 36,
                      borderRadius: 8,
                      fontSize: 13,
                      border: 'none',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      background: !day
                        ? 'transparent'
                        : isDisabled
                          ? '#2a2426'
                          : selectedDays.includes(day!)
                            ? '#e91e8c'
                            : '#1f1b1d',
                      color: !day
                        ? 'transparent'
                        : isDisabled
                          ? '#555'
                          : selectedDays.includes(day!)
                            ? '#fff'
                            : '#ccc',
                      fontWeight: selectedDays.includes(day!) ? 700 : 400,
                    }}
                  // style={{
                  //   height: 36, borderRadius: 8, fontSize: 13, border: 'none', cursor: day ? 'pointer' : 'default',
                  //   background: !day ? 'transparent' : selectedDays.includes(day!) ? '#e91e8c' : '#1f1b1d',
                  //   color: !day ? 'transparent' : selectedDays.includes(day!) ? '#fff' : '#ccc',
                  //   fontWeight: selectedDays.includes(day!) ? 700 : 400,
                  // }}
                  >
                    {day ? String(day).padStart(2, '0') : ''}
                  </button>
                )
              })}
            </div>

            {/* Slot selector + Add button */}
            <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <select value={slotType} onChange={e => setSlotType(e.target.value as SlotType)}
                  style={{
                    width: '100%', appearance: 'none', background: '#1f1b1d', border: '1px solid #555',
                    borderRadius: 20, color: '#fff', fontSize: 13, padding: '7px 32px 7px 14px', cursor: 'pointer'
                  }}>
                  <option value="MORNING">Morning</option>
                  <option value="AFTERNOON">Afternoon</option>
                  <option value="BOTH">Both (Morning + Afternoon)</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
              </div>
              <button onClick={handleAddEntries}
                disabled={selectedDays.length === 0}
                style={{
                  background: selectedDays.length ? '#e91e8c' : '#5a3a4a',
                  color: '#fff', border: 'none', borderRadius: 20, padding: '7px 18px',
                  fontSize: 13, cursor: selectedDays.length ? 'pointer' : 'not-allowed', fontWeight: 600, whiteSpace: 'nowrap'
                }}>
                + Add
              </button>
            </div>
          </div>

          {/* RIGHT: Entries */}
          <div style={{
            flex: 1, background: '#3a3235', borderRadius: 14, padding: isMobile ? 12 : 6,
            display: 'flex', flexDirection: 'column', gap: 10,
            maxHeight: isMobile ? 'calc(70vh - 200px)' : 370, overflowY: 'auto',
            minHeight: isMobile ? 200 : 'auto'
          }}>
            {loadingAgents ? (
              <div style={{ color: '#888', fontSize: 14, textAlign: 'center', marginTop: 40 }}>
                Loading agents...
              </div>
            ) : entries.length === 0 ? (
              <div style={{ color: '#888', fontSize: 14, textAlign: 'center', marginTop: 40 }}>
                Select dates on the calendar and click "+ Add"
              </div>
            ) : (
              dateGroups.map(group => (
                <div key={group.date.toISOString()} style={{
                  borderRadius: 20, padding: 0,
                  display: 'flex', flexDirection: 'column', gap: 12
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {group.items.sort((a, b) => a.slotType.localeCompare(b.slotType)).map(entry => (
                      <div key={entry.id} style={{
                        display: 'grid',
                        border: isEntryInvalid(entry)
                          ? '1px solid #ff4d4f'   // 🔴 red border for invalid
                          : '1px solid rgba(255,255,255,0.05)',
                        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 135px) minmax(0, 125px) minmax(0, 1fr) 30px',
                        gap: isMobile ? 10 : 1, alignItems: 'center', borderRadius: 24, padding: isMobile ? 12 : 6
                      }}>
                        <div style={{
                          background: '#1f1b1d', borderRadius: 9999,
                          color: '#fff', padding: isMobile ? '12px 10px' : '10px 10px', fontSize: isMobile ? 12 : 13,
                          whiteSpace: 'nowrap', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          {formatDisplayDate(group.date)}
                        </div>

                        <div style={{ position: 'relative', gridColumn: isMobile ? '1 / -1' : 'auto', width: isMobile ? '100%' : 'auto' }}>
                          <select value={entry.slotType}
                          disabled
                            // onChange={e => updateEntry(entry.id, 'slotType', e.target.value)}
                            style={{
                              width: '100%', appearance: 'none', background: '#1f1b1d', border: '1px solid #2a2426',
                              borderRadius: 9999, color: '#fff', fontSize: isMobile ? 12 : 13, padding: isMobile ? '12px 36px 12px 14px' : '10px 38px 10px 16px', cursor: 'pointer'
                            }}>
                            <option value="MORNING">Morning</option>
                            <option value="AFTERNOON">Afternoon</option>
                          </select>
                          {/* <ChevronDown size={isMobile ? 12 : 14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} /> */}
                        </div>

                        <div style={{ position: 'relative', gridColumn: isMobile ? '1 / -1' : 'auto' }}>
                          <select value={entry.agentId}
                            onChange={e => updateEntry(entry.id, 'agentId', e.target.value)}
                            style={{
                              width: '100%', appearance: 'none', background: '#1f1b1d', border: '1px solid #2a2426',
                              borderRadius: 9999, color: '#fff', fontSize: isMobile ? 12 : 13, padding: isMobile
                                ? '12px 44px 12px 14px'
                                : '10px 48px 10px 16px', cursor: 'pointer'
                            }}>
                            <option value="">Select agent</option>
                            {agents.map(a => (
                              <option key={a._id} value={a._id}>{a.name}</option>
                            ))}
                          </select>
                          <ChevronDown size={isMobile ? 12 : 14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
                        </div>

                        <button onClick={() => deleteEntry(entry)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e91e8c', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gridColumn: isMobile ? '1 / -1' : 'auto', justifySelf: isMobile ? 'flex-end' : 'auto' }}>
                          <Trash2 size={isMobile ? 16 : 18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 16, marginTop: 22 }}>
          <button onClick={onClose} style={{
            flex: 1, border: '1.5px solid #e91e8c', background: 'transparent',
            color: '#e91e8c', borderRadius: 10, padding: isMobile ? '12px 0' : '13px 0', fontSize: isMobile ? 14 : 15, fontWeight: 600, cursor: 'pointer'
          }}>
            Close
          </button>
          <button onClick={handleSave} disabled={saving || entries.length === 0 || hasInvalidEntries} style={{
            flex: 1, background: saving ? '#a0135e' : entries.length === 0 || hasInvalidEntries ? '#5a3a4a' : '#e91e8c', border: 'none',
            color: '#fff', borderRadius: 10, padding: isMobile ? '12px 0' : '13px 0', fontSize: isMobile ? 14 : 15, fontWeight: 600, cursor: saving || entries.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            {saving ? 'Saving...' : 'Save →'}
          </button>
        </div>
      </div>
    </div>
  );
}