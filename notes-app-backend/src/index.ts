import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// GET
app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
});

// POST
app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    if(!title || !content){
        return res.status(400).send("Unable to insert: title and content required");
    }
    // Catch any database / server errors that may occur
    try {
        const note = await prisma.note.create({
            data: { title, content }
        });
        res.json(note);
    } catch (error) {
        res.status(500).send("Internal server error. Please try again later.");
    }
});

// PUT
app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id)

    if(!title || !content){
        return res.status(400).send("Unable to update: title and content required");
    }
    if(!id || isNaN(id)) {
        res.status(400).send("Invalid data type submitted for 'id'.");
    }
    // Catch any database / server errors that may occur
    try {
        const updated = await prisma.note.update({
            where: { id },
            data: { title, content }
        })
        res.json(updated);
    } catch(error) {
        res.status(500).send("Internal server error. Please try again later.")
    }
});

// DELETE
app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    if(!id || isNaN(id)) {
        res.status(400).send("Invalid data type submitted for 'id'.");
    }
    // Catch any database / server errors that may occur
    try {
        const deleted = await prisma.note.delete({
            where: { id },
        })
        res.status(204).send();
    } catch(error) {
        res.status(500).send("Internal server error. Please try again later.")
    }
});

app.listen(5000, () => {console.log("Server running on localhost:5000")});