import { Component } from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task} from '../../../Task';
import {Users} from '../../../User';
import {Logs} from '../../../Logs';

@Component({
  moduleId: module.id,
  selector: 'tasks',
  templateUrl: 'tasks.component.html'
})

export class TasksComponent { 
    tasks: Task[];
    oneTask: Task[];

    users:Users[];
    logs:Logs[];
    
    title: string;
    date: string;
    description: string;
    changeTaskId: string;

    email: string;
    pass: string;

    upTitle: string;
    upDate: string;
    upDescription: string;

    updateActive=false;
    emailError = false;
    passError = false;
    
    constructor(private taskService:TaskService){
        this.taskService.getTasks()
            .subscribe(tasks => {
                this.tasks = tasks;
            });
    }

    updateList(){
        this.taskService.getTasks()
            .subscribe(tasks => {
                this.tasks = tasks;
            });
    }

    
    addLog(data){
        
        var newLog = {
            description: data,
            date: new Date()
        }

        
        console.log(newLog);
        this.taskService.addLog(newLog)
            .subscribe(log => {
                this.tasks.push(log);
            });
    }

    addUser(event){
        event.preventDefault();
        if (!this.email){
            this.emailError = true;
            this.addLog('Error new user: No email entred')
        }

        if (!this.pass){
            this.passError = true;
            this.addLog('Error new user: No password entred')
        }

        var newUser = {
            email: this.email,
            password: this.pass
        }
        console.log(newUser);
        this.taskService.addUser(newUser)
            .subscribe(user => {
                this.tasks.push(user);
                this.email = '';
                this.pass = '';
                this.emailError = false;
                this.passError = false;
            });
    }
    
    addTask(event){
        event.preventDefault();
        var newTask = {
            title: this.title,
            date: this.date,
            description: this.description,
            isDone: false
        }
        console.log(newTask);
        this.taskService.addTask(newTask)
            .subscribe(task => {
                this.tasks.push(task);
                this.title = '';
                this.date = '';
                this.description = '';
            });
    }

    startUpdate(id){
        this.taskService.getOneTask(id)
            .subscribe(oneTask =>{
                this.oneTask = oneTask;
                console.log(oneTask);
                this.updateActive = true; 
                
                this.changeTaskId= oneTask._id;
                console.log(oneTask._id);
            });
           
    }

    updateTask(event){
        var _task={
            _id : this.changeTaskId,
            title: this.upTitle,
            date: this.upDate,
            description: this.upDescription
        }
        console.log(_task);

        this.taskService.updateTask(_task)
            .subscribe(data =>{
                this.updateActive = false; 
            })
        this.updateList();
    }
    
    deleteTask(id){
        var tasks = this.tasks;
        
        this.taskService.deleteTask(id).subscribe(data => {
            if(data.n == 1){
                for(var i = 0;i < tasks.length;i++){
                    if(tasks[i]._id == id){
                        tasks.splice(i, 1);
                    }
                }
            }
        });
    }
    
    updateStatus(task){
        var _task = {
            _id:task._id,
            title: task.title,
            description:this.description,
            date:task.date,

            isDone: !task.isDone
        };
        
        this.taskService.updateStatus(_task).subscribe(data => {
            task.isDone = !task.isDone;
        });
    }
}
