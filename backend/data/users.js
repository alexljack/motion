import bcrypt from "bcryptjs";

const users = [
  {
    first_name: "Admin",
    last_name: "User",
    username: "admin",
    email: "admin@mail.com",
    password: bcrypt.hashSync("password", 10),
    isAdmin: true,
    height: 188,
    weight: 110,
    gender: "other",
  },
  {
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    email: "john@mail.com",
    password: bcrypt.hashSync("password", 10),
    isAdmin: false,
    height: 160,
    weight: 70,
    gender: "male",
  },
  {
    first_name: "Jane",
    last_name: "Doe",
    username: "janedoe",
    email: "jane@mail.com",
    password: bcrypt.hashSync("password", 10),
    isAdmin: false,
    height: 148,
    weight: 58,
    gender: "female",
  },
];

export default users;
