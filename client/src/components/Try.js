// import { MultiSelect } from "primereact/multiselect";
// import { useState } from "react";

// const paymentTypeItemTemplate = (option) => {
//     debugger;
//     return (
//         <div className="flex align-items-center gap-2">
//             <span>{option.methods_of_payment}</span>
//         </div>
//     );
// };

// export default function Try(options){
//     const [paymentType] = useState(["אשראי", "מזומן"/*
//         { id: 1, description: "אשראי" },
//         { id: 2, description: "מזומן" }*/
//     ]);
//     return (
//         <MultiSelect
//             value={options}
//             options={paymentType}
//             itemTemplate={paymentTypeItemTemplate}
//             onChange={(e) => options.filterApplyCallback(e.value)}
//             optionLabel="description"
//             placeholder="אמצעי תשלום"
//             className="p-column-filter"
//             maxSelectedLabels={3}
//             style={{ minWidth: '14rem' }}
//         />
//     );
// };