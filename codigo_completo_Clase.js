
//src/config/mongoose.js
const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const dbConnection = async() =>{
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conexión correcta a base de datos")
    } catch (error) {
        console.error(error);
    }
}

module.exports = dbConnection;

//src/config/controllers / taskcontroller.js
const TaskModel = require("../models/Task");


const taskController = {
    createTask: async(req,res)=>{
        try {
            const {title} = req.body;
            if(!title || title.length < 3){
                return res.status(400).json({error:"no tiene título o es demasiado corto"});
            }
            const task = await TaskModel.create({title});
            res.status(201).json({data:task,message:"tarea creada"});
        } catch (error) {
            console.error(error);
            res.status(500).json({error:"Error en el servidor"});
        }
    },
    getAllTasks: async (req,res)=>{
        try {
            const tasks = await TaskModel.find();
            res.json( {data:tasks,message:"listado de tareas"});
        } catch (error) {
            console.error(error);
            res.status(500).json({error:"Error en el servidor"}); 
        }
    },
    getTaskById: async(req,res)=>{
        try {
            const id = req.params._id;
            const task = await TaskModel.findById(id);
            if(!task){
                return res.status(404).json({error:"tarea no encontrada"});
            }
            res.json({data:task,message:"tarea encontrada"});
        } catch (error) {
            console.error(error);
            res.status(500).json({error:"Error en el servidor"}); 
        }

    },
    markAsCompleted: async(req,res)=>{
        try {
            const id = req.params._id;
            const task = await TaskModel.findById(id);
            if(!task){
                return res.status(404).json({error:"tarea no encontrada"});
            }
            task.completed = true;
            await task.save();
            res.json({data:task,message:"tarea completada"});
        } catch (error) {
            console.error(error);
            res.status(500).json({error:"Error en el servidor"}); 
        }
    },
    changeTitle: async(req,res)=>{
        try {
            const id = req.params._id;
            const newTitle = req.body.title;
            const oldTask = await TaskModel.find({title});
            if(oldTask){
                return res.status(400).json({error:"ya existe una tarea con ese titulo"})
            }
            const task = await TaskModel.findById(id);
            if(!task){
                return res.status(404).json({error:"tarea no encontrada"});
            }
            task.title = newTitle;
            await task.save();
            res.json({data:task,message:"título modificado"});
        } catch (error) {
            console.error(error);
            res.status(500).json({error:"Error en el servidor"}); 
        }
    },
    deleteTask: async(req,res)=>{
        try {
            const id = req.params._id;
            const deletedTask = await TaskModel.findByIdAndDelete(id);
            res.json({data:deletedTask,message:"tarea borrada"});

        } catch (error) {
            console.error(error);
            res.status(500).json({error:"Error en el servidor"}); 
        }
    }
}

module.exports = taskController;

//src/models/task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true,
    },
    completed:{
        type: Boolean,
        default: false
    }
},{timestamps:true})

module.exports = mongoose.model("Task",TaskSchema);

//src/routes/index.js
const express = require("express");
const taskRouter = require("./task");
const router  =  express.Router();

router.use("/task",taskRouter);


module.exports = router;

//src/routes.task.js
const express = require("express");
const taskController = require("../controllers/TaskController")
const router  =  express.Router();


router.post("/create",taskController.createTask)
router.get("/",taskController.getAllTasks)
router.get("/id/:_id",taskController.getTaskById)

router.put("/markAsCompleted/:_id",taskController.markAsCompleted)
router.put("/id/:_id",taskController.changeTitle)

router.delete("/id/:_id",taskController.deleteTask)

module.exports = router;

//index.js
const express = require("express");
const router = require("./routes");
const dbConnection = require("./config/mongoose");
require("dotenv").config();
const app =  express();
const PORT = process.env.APP_PORT || 3001;
app.use(express.json());


//app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("hello world");
})

app.use("/api",router);

dbConnection();
app.listen(PORT,()=>{
    console.log(`Servidor en el puerto ${PORT}`);
})