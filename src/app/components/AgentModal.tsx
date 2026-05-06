// import { postData, putData } from '@/services/admin-services';
// import Image from 'next/image';
// import { useState, useRef, useEffect } from 'react';

// const ALL_LANGUAGES = ['English', 'Spanish', 'Dutch', 'French'];

// function AgentModal({ onClose, agent, mutateList }: any) {
//   const [name, setName] = useState(agent?.name || '');
//   const [phone, setPhone] = useState(agent?.phoneNumber || '');
//   const [languages, setLanguages] = useState<string[]>(agent?.languages || []);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const [errors, setErrors] = useState<{
//     name?: string;
//     phone?: string;
//     languages?: string;
//   }>({});
//   const dropdownRef = useRef<any>(null);
//   const isFormValid =
//     name.trim() &&
//     /^\+?[0-9]{10,15}$/.test(phone) &&
//     languages.length > 0;

//   const isEdit = !!agent?._id;
//   const validate = () => {
//     const newErrors: typeof errors = {};

//     if (!name.trim()) {
//       newErrors.name = 'Name is required';
//     }

//     if (!phone.trim()) {
//       newErrors.phone = 'Phone is required';
//     } else if (!/^\+?[0-9]{10,15}$/.test(phone)) {
//       newErrors.phone = 'Enter valid 10-digit phone';
//     }

//     if (languages.length === 0) {
//       newErrors.languages = 'Select at least one language';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: any) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const toggleLanguage = (lang: string) => {
//     setLanguages((prev) =>
//       prev.includes(lang)
//         ? prev.filter((l) => l !== lang)
//         : [...prev, lang]
//     );
//   };

//   const removeLanguage = (lang: string) => {
//     setLanguages((prev) => prev.filter((l) => l !== lang));
//   };
//   const handleSubmit = async () => {
//     if (!validate()) return;

//     try {
//       setLoading(true);

//       if (isEdit) {
//         await putData(`/api/audition/agents/${agent._id}`, {
//           name,
//           phoneNumber: phone,
//           languages,
//         });
//       } else {
//         await postData(`/api/audition/agents`, {
//           name,
//           phoneNumber: phone,
//           languages,
//         });
//       }

//       mutateList?.();
//       onClose();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);



//   return (
//     <div
//       className="fixed inset-0 bg-black/70 backdrop-blur-xl backdrop-saturate-150 flex items-center justify-center z-100"
//       style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(0px)' }}
//     >
//       {/* Gradient Border */}
//       <div className="p-[1px] rounded-2xl ">
//         <div className="bg-[#1c1c1c] rounded-2xl w-full max-w-md px-6 py-7" style={{
//           marginTop: isMobile ? 50 : 80,
//           width: isMobile ? 'calc(100vw - 20px)' : 'min(900px, 90vw)',
//           maxHeight: isMobile ? 'calc(100vh - 100px)' : 'auto',
//           borderRadius: 18,
//           margin: 'auto',
//           background: '#2b2426', padding: isMobile ? 12 : 10, boxSizing: 'border-box',
//           overflowY: isMobile ? 'auto' : 'visible'
//         }}>

//           {/* Avatar */}
//           <div className="flex justify-center mb-4">
//             {/* <div className="w-14 h-14 rounded-full bg-[#2a2a2a] flex items-center justify-center text-2xl"> */}
//             <Image
//               src="/assets/reset1.png"
//               alt="avatar"
//               width={82}
//               height={62}
//             />
//             {/* </div> */}
//           </div>

//           {/* Title */}
//           <h2 className="text-center text-white text-lg font-semibold mb-5">
//             {isEdit ? 'Edit Agent' : 'Add New Agent'}
//           </h2>

//           {/* Name */}
//           <input
//             value={name}
//             // onChange={(e) => {
//             //   setName(e.target.value);
//             //   setErrors(prev => ({ ...prev, name: '' }));
//             // }}
//             onChange={(e) => {
//               let value = e.target.value;

//               // Remove non-alphabet characters except space
//               value = value.replace(/[^A-Za-z\s]/g, '');

//               // Prevent multiple spaces
//               value = value.replace(/\s+/g, ' ');

//               // Prevent leading space
//               if (value.startsWith(' ')) return;

//               setName(value);
//               setErrors(prev => ({ ...prev, name: '' }));
//             }}
//             placeholder="Name"
//             className="w-full mb-3 px-4 py-2 bg-[#121212] text-white rounded-full border border-[#2a2a2a] focus:outline-none focus:border-pink-500"
//           />
//           {errors.name && (
//             <p className="text-red-400 text-xs  ml-2">{errors.name}</p>
//           )}

//           {/* Phone */}
//           <input
//             value={phone}
//             onChange={(e) => {
//               let value = e.target.value;

//               // Allow only digits and +
//               value = value.replace(/[^0-9+]/g, '');

//               // Ensure only one + at the start
//               if (value.includes('+')) {
//                 value = '+' + value.replace(/\+/g, '');
//               }

//               // Limit to max 15 digits (excluding +)
//               const isPlus = value.startsWith('+');
//               let digits = value.replace('+', '');

//               digits = digits.slice(0, 15);

//               value = isPlus ? `+${digits}` : digits;

//               setPhone(value);
//               setErrors(prev => ({ ...prev, phone: '' }));
//             }}
//             // onChange={(e) => {
//             //   let value = e.target.value;

//             //   // Allow only digits and one leading +
//             //   value = value.replace(/[^0-9+]/g, '');

//             //   // Ensure only one + and only at start
//             //   if (value.includes('+')) {
//             //     value = '+' + value.replace(/\+/g, '');
//             //   }

//             //   setPhone(value);
//             //   setErrors(prev => ({ ...prev, phone: '' }));
//             // }}
//             placeholder="Phone"
//             className="w-full mb-4 px-4 py-2 bg-[#121212] text-white rounded-full border border-[#2a2a2a] focus:outline-none focus:border-pink-500"
//           />
//           {errors.phone && (
//             <p className="text-red-400 text-xs mt-1 ml-2">{errors.phone}</p>
//           )}

//           {/* Languages Multi Select */}
//           <div className="relative mb-5" ref={dropdownRef}>
//             {/* Input */}
//             <div
//               onClick={() => setOpen(!open)}
//               className="w-full min-h-[44px] px-4 py-2 bg-[#121212] rounded-full border border-[#2a2a2a] flex flex-wrap gap-2 items-center cursor-pointer"
//             >
//               {languages.length === 0 && (
//                 <span className="text-gray-500 text-sm">Languages</span>
//               )}

//               {languages.map((lang) => (
//                 <span
//                   key={lang}
//                   className="bg-[#2a2a2a] text-white text-sm px-3 py-1 rounded-full flex items-center gap-1"
//                 >
//                   {lang}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeLanguage(lang);
//                     }}
//                     className="text-gray-400 hover:text-pink-400"
//                   >
//                     ✕
//                   </button>
//                 </span>
//               ))}
//             </div>
//             {errors.languages && (
//               <p className="text-red-400 text-xs mt-1 ml-2">{errors.languages}</p>
//             )}

//             {/* Dropdown */}
//             {open && (
//               <div className="absolute w-full mt-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
//                 {ALL_LANGUAGES.map((lang) => (
//                   <div
//                     key={lang}
//                     onClick={() => toggleLanguage(lang)}
//                     className="px-4 py-2 text-white hover:bg-[#2a2a2a] cursor-pointer flex justify-between"
//                   >
//                     {lang}
//                     {languages.includes(lang) && (
//                       <span className="text-pink-400">✓</span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="cursor-pointer flex-1 py-2 rounded-full border border-[#EF476F] text-[#EF476F] hover:bg-pink-500/10 transition"
//             >
//               Close
//             </button>

//             <button
//               onClick={handleSubmit}
//               disabled={loading || !isFormValid}
//               className={`cursor-pointer flex-1 py-2 rounded-full text-white font-medium transition
//     ${loading || !isFormValid
//                   ? 'bg-[#7a2a3f] cursor-not-allowed'
//                   : 'bg-[#EF476F] hover:opacity-90'
//                 }`}
//             >
//               {loading ? 'Saving...' : 'Save →'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AgentModal;











import { postData, putData } from '@/services/admin-services';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const ALL_LANGUAGES = ['English', 'Spanish', 'Dutch', 'French'];

function AgentModal({ onClose, agent, mutateList }: any) {
  const [name, setName] = useState(agent?.name || '');
  const [phone, setPhone] = useState(agent?.phoneNumber || '');
  const [languages, setLanguages] = useState<string[]>(agent?.languages || []);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    languages?: string;
  }>({});

  const dropdownRef = useRef<any>(null);

  // ✅ Phone is optional now
  const isFormValid =
    name.trim() &&
    (phone.trim() === '' || /^\+?[0-9]{10,15}$/.test(phone)) &&
    languages.length > 0;

  const isEdit = !!agent?._id;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    // ✅ Only validate phone if user entered something
    if (phone.trim() && !/^\+?[0-9]{10,15}$/.test(phone)) {
      newErrors.phone = 'Enter valid phone number';
    }

    if (languages.length === 0) {
      newErrors.languages = 'Select at least one language';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
  };

  const removeLanguage = (lang: string) => {
    setLanguages((prev) => prev.filter((l) => l !== lang));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // ✅ Build payload dynamically
      const payload: any = {
        name,
        languages,
      };

      if (phone.trim()) {
        payload.phoneNumber = phone;
      }

      if (isEdit) {
        await putData(`/api/audition/agents/${agent._id}`, payload);
      } else {
        await postData(`/api/audition/agents`, payload);
      }

      mutateList?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xl backdrop-saturate-150 flex items-center justify-center z-100"
      style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(0px)' }}
    >
      <div className="p-[1px] rounded-2xl ">
        <div
          className="bg-[#1c1c1c] rounded-2xl w-full max-w-md px-6 py-7"
          style={{
            marginTop: isMobile ? 50 : 80,
            width: isMobile ? 'calc(100vw - 20px)' : 'min(900px, 90vw)',
            maxHeight: isMobile ? 'calc(100vh - 100px)' : 'auto',
            borderRadius: 18,
            margin: 'auto',
            background: '#2b2426',
            padding: isMobile ? 12 : 10,
            boxSizing: 'border-box',
            overflowY: isMobile ? 'auto' : 'visible',
          }}
        >
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <Image src="/assets/reset1.png" alt="avatar" width={82} height={62} />
          </div>

          {/* Title */}
          <h2 className="text-center text-white text-lg font-semibold mb-5">
            {isEdit ? 'Edit Agent' : 'Add New Agent'}
          </h2>

          {/* Name */}
          <input
            value={name}
            onChange={(e) => {
              let value = e.target.value;

              value = value.replace(/[^A-Za-z\s]/g, '');
              value = value.replace(/\s+/g, ' ');
              if (value.startsWith(' ')) return;

              setName(value);
              setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="Name"
            className="w-full mb-3 px-4 py-2 bg-[#121212] text-white rounded-full border border-[#2a2a2a] focus:outline-none focus:border-pink-500"
          />
          {errors.name && (
            <p className="text-red-400 text-xs ml-2">{errors.name}</p>
          )}

          {/* Phone (Optional) */}
          <input
            value={phone}
            onChange={(e) => {
              let value = e.target.value;

              value = value.replace(/[^0-9+]/g, '');

              if (value.includes('+')) {
                value = '+' + value.replace(/\+/g, '');
              }

              const isPlus = value.startsWith('+');
              let digits = value.replace('+', '');
              digits = digits.slice(0, 15);

              value = isPlus ? `+${digits}` : digits;

              setPhone(value);
              setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            placeholder="Phone (optional)"
            className="w-full mb-4 px-4 py-2 bg-[#121212] text-white rounded-full border border-[#2a2a2a] focus:outline-none focus:border-pink-500"
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.phone}</p>
          )}

          {/* Languages */}
          <div className="relative mb-5" ref={dropdownRef}>
            <div
              onClick={() => setOpen(!open)}
              className="w-full min-h-[44px] px-4 py-2 bg-[#121212] rounded-full border border-[#2a2a2a] flex flex-wrap gap-2 items-center cursor-pointer"
            >
              {languages.length === 0 && (
                <span className="text-gray-500 text-sm">Languages</span>
              )}

              {languages.map((lang) => (
                <span
                  key={lang}
                  className="bg-[#2a2a2a] text-white text-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {lang}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLanguage(lang);
                    }}
                    className="text-gray-400 hover:text-pink-400"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            {errors.languages && (
              <p className="text-red-400 text-xs mt-1 ml-2">
                {errors.languages}
              </p>
            )}

            {open && (
              <div className="absolute w-full mt-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                {ALL_LANGUAGES.map((lang) => (
                  <div
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className="px-4 py-2 text-white hover:bg-[#2a2a2a] cursor-pointer flex justify-between"
                  >
                    {lang}
                    {languages.includes(lang) && (
                      <span className="text-pink-400">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 py-2 rounded-full border border-[#EF476F] text-[#EF476F] hover:bg-pink-500/10 transition"
            >
              Close
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className={`cursor-pointer flex-1 py-2 rounded-full text-white font-medium transition
              ${
                loading || !isFormValid
                  ? 'bg-[#7a2a3f] cursor-not-allowed'
                  : 'bg-[#EF476F] hover:opacity-90'
              }`}
            >
              {loading ? 'Saving...' : 'Save →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentModal;