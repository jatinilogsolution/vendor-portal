// import { hashPassword } from "./argon2";
// import { prisma } from "./prisma";

// export const seedRoleData = async () => {
//   const roles = [
//     { name: 'USER', description: 'Regular user with basic access' },
//     { name: 'ADMIN', description: 'Administrator with elevated privileges' },
//     { name: 'SUPER_ADMIN', description: 'Full access to all resources' },
//     { name: 'VENDOR', description: 'Vendor with product management access' },
//     { name: 'VENDOR_ADMIN', description: 'Administrator with vendor management access' }
//   ];

//   // Loop through roles and upsert them
//   for (const role of roles) {
//     const res = await prisma.role.upsert({
//       where: {
    
//           name: role.name, 
//           description: role.description
   
//       },
//       update: {}, // No updates needed
//       create: { 
//         name: role.name, 
//         description: role.description 
//       },
//     });

//     console.table(res);  // Log the result for each role inserted
//   }

//   console.log("Seed data inserted");

//   // Disconnect Prisma client after operations
//   await prisma.$disconnect();
// };
 



// // export const seedSuperAdminData = async () => {
 
// //     const role = await prisma.role.findFirst({
// //         where :{
// //         name: "SUPER_ADMIN"
// //         }
// //     })
   
// //  const hashPass =await  hashPassword("Admin@123"); 
// //   await prisma.user.create({
// //      data:{
// //         email:"jatin.sharma@ilogsolution.com",
// //         name:"Jatin Sharma",
// //         emailVerified:true,
// //         role: { connect: { id: role?.id } },
// //         password: hashPass
// //      }
// //     });
   
 

// //   console.log("Seed data inserted");

// //   // Disconnect Prisma client after operations
// //   await prisma.$disconnect();
// // };
 