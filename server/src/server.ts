import express, { Request, Response } from 'express';
import connectToDatabase from './db';
import userRouters from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import taskRoutes from './routes/task.routes';

const application = express();

application.use(express.json());

const PORT = 4000;

connectToDatabase();

application.get('/ping',(request:Request, response: Response) => {
    response.send('pong');
})

application.use("/users", userRouters)
application.use("/categories", categoryRoutes)
application.use("/tasks", taskRoutes)


application.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})