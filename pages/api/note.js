import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  if (req.method === "GET") {
    const { email } = req.query;
    const notes = await prisma.Note.findMany({ where: { authorId: email } });
    res.send(notes);
  } else if (req.method === "POST") {
    const { title, note, key, email } = req.body;
    try {
      const response = await prisma.Note.create({
        data: {
          title,
          note,
          key,
          author: {
            connect: {
              email,
            },
          },
        },
      });
      console.log(response);
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(400).send({ msg: "Data not saved" });
    }
  } else if (req.method === "PUT") {
    const { title, note, key, email } = req.body;
    try {
      const response = await prisma.Note.updateMany({
        where: {
          AND: [{ authorId: email }, { key }],
        },
        data: {
          title,
          note,
        },
      });
      console.log(response);
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(400).send({ msg: "Data not saved" });
    }
  } else if (req.method === "DELETE") {
    const { email, key } = req.body;
    try {
      const response = await prisma.Note.deleteMany({
        where: {
          AND: [{ authorId: email }, { key }],
        },
      });
      console.log(response);
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(400).send({ msg: "Data not deleted" });
    }
  }
}
