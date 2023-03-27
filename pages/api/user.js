import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  if (req.method === "POST") {
    const { email, password } = req.body;
    let user = await prisma.User.findUnique({
      where: {
        email,
      },
    });
    if (user === null) {
      user = await prisma.User.create({
        data: {
          email,
          password,
        },
      });
      res.status(200).send(user);
    } else if (user.password === password) {
      res.status(200).send(user);
    } else {
      res.status(400).send({ msg: "incorrect password" });
    }
  }
}
