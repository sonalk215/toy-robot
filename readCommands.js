let position="0,0";
let x=0;
let y=0;
let direction='';
let error=0;
let errCommand=''

document.getElementById('inputfile').addEventListener('change', function() {
    let fr=new FileReader();
    fr.onload=()=>{
        startValidatingCommands(fr.result)
    } 
    fr.readAsText(this.files[0]);
})

const startValidatingCommands=txt=>{
    let commandsArr=txt.split('\n');
    commandsArr=commandsArr.map(el=>el.trim()).filter(el=>el);
    validateFirstCommand(commandsArr, 'Y');
}

const showErrMsg=msg=>{
    let errToast=document.getElementsByClassName('toastrMessage')[0];
    if(errToast.classList.contains('successMsg')) {
        errToast.classList.remove('successMsg');
    }
    errToast.classList.add('errorMsg');
    errToast.innerHTML=msg;
}

const showSuccessMsg=msg=>{
    let toast=document.getElementsByClassName('toastrMessage')[0];
    if(toast.classList.contains('errorMsg')) {
        toast.classList.remove('errorMsg');
    }
    toast.classList.add('successMsg');
    toast.innerHTML=msg;
}

const validateFirstCommand=(commands,first='Y')=>{
    let chkPlace='';
    let errToast=document.getElementsByClassName('toastrMessage')[0];
    if(first==='Y') {
        chkPlace=commands[0].trim().slice(0,5);
    }
    else { chkPlace=commands.slice(0,5); }

    if(chkPlace!=='PLACE') {
        showErrMsg("PLACE should be the command");
        error=1;
        errCommand=command;
    }
    else {
        let secPattern=first==='Y' ? commands[0].trim().slice(5) : commands.trim().slice(5);
        let secPatternArr=secPattern.trim().split(',');

        let partOne=secPatternArr[0].trim();
        let partTwo=secPatternArr[1].trim();
        let partThree=secPatternArr[2].trim();

        if(partOne<0 || partOne>5) {
            showErrMsg("x is not inside 0 and 5");
            error=1;
        }
        else {
            x=partOne;
        }
        if(partTwo<0 || partTwo>5) {
            showErrMsg("y is not inside 0 and 5");
            error=1;
        }
        else {
            y=partTwo;
        }

        if(partThree!=='NORTH' && partThree!=='EAST' && partThree!=='WEST' && partThree!=='SOUTH') {
            showErrMsg("Valid directions- NORTH, SOUTH, WEST and EAST");
            error=1
        }
        else {direction=partThree;}
    }
    if(!error) {
        position=x+','+y;
        console.log("positon at start and direction ", x,y, direction);
        if(first==='Y') { checkOtherCommands(commands.slice(1)); }
    }
}

const checkOtherCommands=elms=>{
    let arr=elms.map(el=>el.trim()).filter(el=>el)

    for (let i=0;i<arr.length;i++) {
        let firstLetter=arr[i].substring(0,1);

        if(error===1) {
            showErrMsg("Wrong command "+errCommand);
        }
        else {
            switch (firstLetter) {
                case 'P':
                    validateFirstCommand(arr[i], 'N');
                    break;
                case 'L':
                    validateLeftCommand(arr[i]);
                    break;
                case 'M':
                    validateMoveCommand(arr[i]);
                    break;
                case 'R':
                    validateRCommand(arr[i]);
                    break;
                default:
                    error=1;
                    errCommand=arr[i]
            }
        }
    }
}
const validateMoveCommand=command=>{
    if(command.trim()!=='MOVE' ||error===1 ) {
        errCommand=command;
        error=1;
        showErrMsg("WRONG COMMAND "+errCommand);
    }
    else {
        if(x===0  && direction==='WEST') {
            error=1
            showErrMsg("MOVE not allowed for x=0 and WEST");
        }
        else if(x===5 && direction==='EAST') {
            error=1
            showErrMsg("MOVE not allowed for x=5 and EAST");
        }
        else if (y===0 && direction==='SOUTH') {
            error=1
            showErrMsg("MOVE not allowed for y=0 and SOUTH");
        }
        else if(y===5 && direction==='NORTH') {
            error=1
            showErrMsg("MOVE not allowed for y=5 and NORTH");
        }
        else if (x===5 && y===5 &&(direction==='EAST' || direction==='NORTH' )) {
            error=1
            showErrMsg("MOVE not allowed for x=5, Y=5 and NORTH and EAST");
        }
        else if (x===0 && y===0 &&(direction==='WEST' || direction==='SOUTH' )) {
            error=1
            showErrMsg("MOVE not allowed for x=5, Y=5 and WEST and SOUTH");
        }
        else {
            x=parseInt(x);
            y=parseInt(y);
            x=direction==='EAST' ? x+1 : direction==='WEST' ? x-1 : x;
            y=direction==='NORTH' ? y+1 : direction==='SOUTH' ? y-1 : y;        
        }
    }
    console.log("AFTER MOVE  ",x, y, direction);
}

const validateLeftCommand=command=>{
    let tempDirection=direction;
    if(command.trim()!=='LEFT' ||error===1) {
        errCommand=command;
        error=1
        showErrMsg("WRONG COMMAND "+errCommand);
    }
    else {
        if(direction==='NORTH') {
            tempDirection='WEST'
        }
        if(direction==='SOUTH') {
            tempDirection='EAST'
        }
        if(direction==='WEST') {
            tempDirection='SOUTH'
        }
        if(direction==='EAST') {
            tempDirection='NORTH'
        }
        direction=tempDirection
    }    
}

const validateRCommand=command=>{
    if(command.trim()==='RIGHT' && error!==1) {
        validateRightCommand(command)
    }
    else if(command.trim()==='REPORT' && error!==1) {
        validateReportCommand(command)
    }
    else {
        error=1
        errCommand=command;
        showErrMsg("WRONG COMMAND "+errCommand);
    }
}

const validateRightCommand=rightComm=>{
    let tempDirection=direction;

    if(direction==='NORTH') {
        tempDirection='EAST'
    }
    if(direction==='SOUTH') {
        tempDirection='WEST'
    }
    if(direction==='WEST') {
        tempDirection='NORTH'
    }
    if(direction==='EAST') {
        tempDirection='SOUTH'
    }
    direction=tempDirection;
}

const validateReportCommand=reportComm=>{
    console.log("coming to repor")
    showSuccessMsg("Position is  " + x+','+y+','+direction)
}