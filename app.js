const readline = require('readline'); 
const fs = require('fs'); 
const path = require('path'); 


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const filepath = path.join(__dirname, 'tasks.json');

const loadTasks = ()=>{
  if(fs.existsSync(filepath)){
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
  }

  fs.writeFileSync(filepath, JSON.stringify([]));
  return [];
}

const saveTasks = (tasks)=>{
  fs.writeFileSync(filepath, JSON.stringify(tasks, null,2));
}



//write code here 
const displayMenu = ()=>{
console.log("==== To-Do App ====\n"+
"1) Add a task\n" +
"2) List tasks\n" +
"3) Delete a task\n" +
"4) Mark task as done\n" +
"5) Exit\n"+ 
"====================\n");
}



const askForInput = (questionText)=>{
  return new Promise((resolve)=> (rl.question(questionText, (choice)=>{
    resolve(choice);
  })));
}


const processCommand = async (command, tasks)=>{
  console.log('Processing your choice ... ');
  switch(command){

    case '1':
      const descr = (await askForInput('Enter Task Description: ')).trim();

        const taskDescr = descr.trim();
        if(taskDescr.length>0){
          const newTask = {taskID: tasks.length+1, taskDescr: descr, completed: false};
          tasks.push(newTask);
          saveTasks(tasks);
          console.log('Tasks : ', newTask , ' is Saved');
        } 
    break;

    case '2':
      if(tasks.length ===0){
        console.log('No Task in List');
        break;
      }
      console.log('To-Do Lists: ');
      tasks.forEach((task)=>{
        console.log(`Task ID : ${task.taskID} , Descr : ${task.taskDescr} , Completed : ${task.completed}`)
      })
    break;

    case '3':
      if(tasks.length ===0){
        console.log('No Task in List');
        break;
      }

      console.log('To-Do Lists: ');
      tasks.forEach((task)=>{
        console.log(`Task ID : ${task.taskID} , Descr : ${task.taskDescr} , Completed : ${task.completed}`)
      })

      const taskID = parseInt((await askForInput('Key In taskID to be deleted: ')),10);
      
      const tasksIndex = tasks.findIndex((task)=>task.taskID===taskID);
      if(tasksIndex < 0){
        console.log('taskID cannot be found');
        break;
      }

      const deletedTask = tasks.splice(tasksIndex,1)[0]
      console.log(`TaskID : ${deletedTask.taskID} is deleted`);
      saveTasks(tasks);
    break;


    case '4':
      if(tasks.length ===0){
        console.log('No Task in List');
        break;
      }

      console.log('To-Do Lists: ');
      tasks.forEach((task)=>{
        console.log(`Task ID : ${task.taskID} , Descr : ${task.taskDescr} , Completed : ${task.completed}`)
      })

      const completedTaskID = parseInt((await askForInput('Key In taskID to be completed: ')),10);
      
      const completedTasksIndex = tasks.findIndex((task)=>task.taskID===completedTaskID);
      if(completedTasksIndex < 0){
        console.log('taskID cannot be found');
        break;
      }

      tasks[completedTasksIndex].completed = true;
      console.log(`TaskID : ${tasks[completedTasksIndex].taskID} is completed`);
      saveTasks(tasks);
    break;


    default:
    break;

  }
  return;

}

const main = async()=>{

  let command = '';
  const tasks = loadTasks();
  // console.log('tasks : ', tasks);
  displayMenu();
  while(command !== '5'){
    command = await askForInput('What is your command ? : ');
    await processCommand(command, tasks);
    displayMenu();
  }
  rl.close();
}


main();
