import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@mail.com",
    password: bcrypt.hashSync("password", 10),
    isAdmin: true,
    height: 188,
    weight: 110,
    goals: [],
  },
  {
    name: "John Doe",
    email: "john@mail.com",
    password: bcrypt.hashSync("password", 10),
    isAdmin: false,
    height: 160,
    weight: 70,
    goals: [],
  },
  {
    name: "Jane Doe",
    email: "jane@mail.com",
    password: bcrypt.hashSync("password", 10),
    isAdmin: false,
    height: 148,
    weight: 58,
    goals: [],
  },
];

export default users;
