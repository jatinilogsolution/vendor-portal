// "use client";

// import * as React from "react";
// import {  Controller, ControllerRenderProps, useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/input";
//  import { checkFileExists, deleteFileFromAzure, uploadFileToAzure } from "@/services/azure-blob";


// type FormValues = {
//     file: FileList;
//     folder: string;
// };

// export const FileUploader = () => {
//     const { handleSubmit, control } = useForm<FormValues>({
//         defaultValues: { folder: "user/profile" },
//     });

//     const [fileUrl, setFileUrl] = React.useState<string | null>(null);
//     const [loading, setLoading] = React.useState(false);

//     const onSubmit = async (data: FormValues) => {
//         const file = data.file?.[0];
//         if (!file) return alert("Please select a file");

//         setLoading(true);

//         try {
//             const folderPath = data.folder;

//             // 1️⃣ Check if file exists
//             const exists = await checkFileExists(folderPath, file.name);

//             if (exists) {
//                 const confirmed = confirm(
//                     "File already exists. Do you want to delete the previous file and upload a new one?"
//                 );
//                 if (!confirmed) return;
//                 await deleteFileFromAzure(folderPath, file.name);
//             }

//             // 2️⃣ Upload new file
//             const url = await uploadFileToAzure(file, folderPath);
//             setFileUrl(url);

//         } catch (err) {
//             console.error(err);
//             alert("Upload failed: " + (err as Error).message);
//         } finally {
//             setLoading(false);
//         }
//     };


//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <Controller
//                 name="file"
//                 control={control}
//                 render={({ field }) => (
//                     <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
//                 )}
//             />

//             <Controller
//                 name="folder"
//                 control={control}
//                 render={({ field }) => (
//                     <Input placeholder="Folder path in blob" {...field} />
//                 )}
//             />

//             <Button type="submit" disabled={loading}>
//                 {loading ? "Uploading..." : "Upload"}
//             </Button>

//             {fileUrl && (
//                 <div>
//                     File uploaded:{" "}
//                     <a href={fileUrl} target="_blank" className="text-blue-600 underline">
//                         {fileUrl}
//                     </a>
//                 </div>
//             )}
//         </form>
//     );
// };

 
// type AzureFileUploaderProps = {
//   field: ControllerRenderProps<any, any>;
//   folderPath?: string; // default folder
// };

// export const AzureFileUploader: React.FC<AzureFileUploaderProps> = ({ field, folderPath = "user/profile" }) => {
//   const [fileUrl, setFileUrl] = React.useState<string | null>(field.value || null);
//   const [loading, setLoading] = React.useState(false);

//   const handleFileChange = async (files: FileList | null) => {
//     if (!files?.[0]) return;

//     const file = files[0];
//     setLoading(true);

//     try {
//       // Check if file exists
//       const exists = await checkFileExists(folderPath, file.name);
//       if (exists) {
//         const confirmed = confirm(
//           "File already exists. Do you want to delete the previous file and upload a new one?"
//         );
//         if (!confirmed) return;
//         await deleteFileFromAzure(folderPath, file.name);
//       }

//       // Upload file
//       const url = await uploadFileToAzure(file, folderPath);
//       setFileUrl(url);

//       // Update the form value with the uploaded URL
//       field.onChange(url);
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed: " + (err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <Input
//         type="file"
//         onChange={(e) => handleFileChange(e.target.files)}
//         disabled={loading}
//       />
//       {fileUrl && (
//         <p className="text-sm text-gray-600">Uploaded URL: <a href={fileUrl} target="_blank" className="text-blue-600 underline">{fileUrl}</a></p>
//       )}
//       {loading && <p className="text-sm text-gray-500">Uploading...</p>}
//     </div>
//   );
// };
