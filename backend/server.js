require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cis3339_homework1';
const DATABASE_NAME = process.env.MONGODB_DB_NAME || 'cis3339_homework1';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

const mongoClient = new MongoClient(MONGODB_URI);
let database;

function collection(name) {
    if (!database) throw new Error('MongoDB is not connected');
    return database.collection(name);
}

function sendDatabaseError(res, error, duplicateMessage) {
    if (error.code === 11000) return res.status(409).send({ error: duplicateMessage });
    console.error(error);
    return res.status(500).send({ error: 'Internal server error' });
}

async function initializeDatabase() {
    await mongoClient.connect();
    database = mongoClient.db(DATABASE_NAME);
    await Promise.all([
        collection('students').createIndex({ id: 1 }, { unique: true }),
        collection('courses').createIndex({ id: 1 }, { unique: true }),
        collection('enrollments').createIndex({ studentId: 1, courseId: 1 }, { unique: true }),
        collection('enrollments').createIndex({ courseId: 1 }),
        collection('enrollments').createIndex({ studentId: 1 }),
    ]);
}

app.post('/find-student', async (req, res) => {
    try {
        const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
        if (!name) return res.status(400).send({ error: 'Student name is required' });
        const student = await collection('students').findOne({ name }, { projection: { _id: 0 } });
        if (!student) return res.status(404).send({ error: 'Student not found' });
        return res.send(student);
    } catch (error) { return sendDatabaseError(res, error, 'Unable to search for student'); }
});

app.get('/students', async (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('text/html')) return res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
    try {
        const students = await collection('students').find({}, { projection: { _id: 0 } }).sort({ name: 1 }).toArray();
        return res.send(students);
    } catch (error) { return sendDatabaseError(res, error, 'Unable to list students'); }
});

app.post('/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;
        const student = {
            name: typeof name === 'string' ? name.trim() : '',
            id: id === undefined || id === null ? '' : String(id).trim(),
            phone: typeof phone === 'string' ? phone.trim() : '',
            zip: zip === undefined || zip === null ? '' : String(zip).trim(),
        };
        if (!student.name || !student.id || !student.phone || !student.zip) return res.status(400).send({ error: 'All fields (name, id, phone, zip) are required' });
        await collection('students').insertOne(student);
        return res.status(201).send({ message: 'Student added successfully', student });
    } catch (error) { return sendDatabaseError(res, error, 'A student with that ID already exists'); }
});

app.post('/delete-student', async (req, res) => {
    try {
        const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
        if (!name) return res.status(400).send({ error: 'Student name is required' });
        const deletedStudent = await collection('students').findOneAndDelete({ name }, { projection: { _id: 0 } });
        if (!deletedStudent) return res.status(404).send({ error: 'Student not found' });
        await collection('enrollments').deleteMany({ studentId: deletedStudent.id });
        return res.send({ message: 'Student deleted successfully', student: deletedStudent });
    } catch (error) { return sendDatabaseError(res, error, 'Unable to delete student'); }
});

app.get('/courses', async (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('text/html')) return res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
    try {
        const courses = await collection('courses').find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
        return res.send(courses);
    } catch (error) { return sendDatabaseError(res, error, 'Unable to list courses'); }
});

app.post('/courses', async (req, res) => {
    try {
        const { id, name } = req.body;
        const course = { id: id === undefined || id === null ? '' : String(id).trim(), name: typeof name === 'string' ? name.trim() : '' };
        if (!course.id || !course.name) return res.status(400).send({ error: 'Course ID and course name are required' });
        await collection('courses').insertOne(course);
        return res.status(201).send({ message: 'Course added successfully', course });
    } catch (error) { return sendDatabaseError(res, error, 'A course with that ID already exists'); }
});

app.delete('/courses/:id', async (req, res) => {
    try {
        const courseId = String(req.params.id).trim();
        const deletedCourse = await collection('courses').findOneAndDelete({ id: courseId }, { projection: { _id: 0 } });
        if (!deletedCourse) return res.status(404).send({ error: 'Course not found' });
        await collection('enrollments').deleteMany({ courseId });
        return res.send({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (error) { return sendDatabaseError(res, error, 'Unable to delete course'); }
});

app.post('/enrollments', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const normalizedStudentId = studentId === undefined || studentId === null ? '' : String(studentId).trim();
        const normalizedCourseId = courseId === undefined || courseId === null ? '' : String(courseId).trim();
        if (!normalizedStudentId || !normalizedCourseId) return res.status(400).send({ error: 'Student ID and course ID are required' });
        const [student, course] = await Promise.all([collection('students').findOne({ id: normalizedStudentId }), collection('courses').findOne({ id: normalizedCourseId })]);
        if (!student) return res.status(404).send({ error: 'Student not found' });
        if (!course) return res.status(404).send({ error: 'Course not found' });
        const enrollment = { studentId: normalizedStudentId, courseId: normalizedCourseId };
        await collection('enrollments').insertOne(enrollment);
        return res.status(201).send({ message: 'Student enrolled successfully', enrollment });
    } catch (error) { return sendDatabaseError(res, error, 'This student is already enrolled in the course'); }
});

app.get('/courses/:id/students', async (req, res) => {
    try {
        const courseId = String(req.params.id).trim();
        if (!await collection('courses').findOne({ id: courseId })) return res.status(404).send({ error: 'Course not found' });
        const enrollments = await collection('enrollments').find({ courseId }, { projection: { _id: 0, studentId: 1 } }).toArray();
        const students = await collection('students').find({ id: { $in: enrollments.map((enrollment) => enrollment.studentId) } }, { projection: { _id: 0 } }).sort({ name: 1 }).toArray();
        return res.send(students);
    } catch (error) { return sendDatabaseError(res, error, 'Unable to list enrolled students'); }
});

app.use((req, res) => {
    if (req.method === 'GET' && req.headers.accept && req.headers.accept.includes('text/html')) return res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
    return res.status(404).send({ error: 'Endpoint not found' });
});

async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Connected to MongoDB database: ${DATABASE_NAME}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error.message);
        await mongoClient.close();
        process.exitCode = 1;
    }
}

startServer();
