const electron = require('electron');
const ipc = electron.ipcRenderer;


// GUI FUNCTIONALITY CODE

lastChanged = false;

// Window Close Button
const closeBtn = document.getElementById('win-close');
closeBtn.addEventListener('click', () => {
    ipc.send('exit');
});
closeBtn.addEventListener('mouseover', () => {
    document.getElementById('win-close-img').setAttribute('src', '../win_close_btn_highlighted.png');
});
closeBtn.addEventListener('mouseout', () => {
    document.getElementById('win-close-img').setAttribute('src', '../win_close_btn.png');
});

// Window Minimise Button
const minBtn = document.getElementById('win-minimise');
minBtn.addEventListener('click', () => {
    ipc.send('min');
});
minBtn.addEventListener('mouseover', () => {
    document.getElementById('win-minimise-img').setAttribute('src', '../win_minimise_btn_highlighted.png');
});
minBtn.addEventListener('mouseout', () => {
    document.getElementById('win-minimise-img').setAttribute('src', '../win_minimise_btn.png');
});


// PAGE FUNCTIONALITY CODE

// Enforce Limits for Hour Counter Field
function hourMinMax(hourCounter) {   //  Only checks if value invalid or > 59 and resets to 59 if overflowed (cuz obviously)
    lastChanged = true;    if (hourCounter.value == "") {
        hourCounter.value = "0";
    } else if (hourCounter.value != "0" && hourCounter.value.startsWith('0')) {
        hourCounter.value = parseInt(hourCounter.value).toString();
    }  else if (parseInt(hourCounter.value > 59)) {
        hourCounter.value = "59";
    } else if (parseInt(hourCounter.value) < 0) {
        hourCounter.value = "0"
    }
}

// Enforce Limits for Minute Counter Field
function minMinMax(minCounter) {    // Same functionality and algorithm as secMinMax
    lastChanged = true;
    if (minCounter.value == "") {
        minCounter.value = "0";
    } else if (minCounter.value != "0" && minCounter.value.startsWith('0')) {
        minCounter.value = parseInt(minCounter.value).toString();
    }  else if (parseInt(minCounter.value) > 59) {
        n = parseInt(minCounter.value);
        hours = Math.floor(n / 60);
        mins = n % 60;
        minCounter.value = mins.toString();
        hourCounter = document.getElementById('counter-hours');
        hours += parseInt(hourCounter.value)
        hourCounter.value = hours.toString();
        hourMinMax(hourCounter);
    } else if (parseInt(minCounter.value) < 0) {
        minCounter.value = "0"
    }
}

// Enforce Limits for Second Counter Field
function secMinMax(secCounter) {
    lastChanged = true;
    if (secCounter.value == "") {
        secCounter.value = "0";
    } else if (secCounter.value != "0" && secCounter.value.startsWith('0')) {
        secCounter.value = parseInt(secCounter.value).toString();
    } else if (parseInt(secCounter.value) > 59) {
        n = parseInt(secCounter.value);                                    // Get stored value
        mins = Math.floor(n / 60);                                         // Divide by 60, quotient is number of mins
        secs = n % 60;                                                     // Remainder is number of seconds
        secCounter.value = secs.toString();                                // Replace seconds counter value
        minCounter = document.getElementById('counter-minutes');           // Get minutes counter field
        mins += parseInt(minCounter.value);                                // Calculate converted minutes + existing minutes
        minCounter.value = mins.toString();                                // Update mins value
        minMinMax(minCounter);                                             // Call minmax function for minutes counter in case minutes overflowedd 59.
    } else if (parseInt(secCounter.value) < 0) {
        secCounter.value = "0"
    }
}

// Add & Subtract from Second Counter Field
function updateSec(val) {
    secCounter = document.getElementById('counter-seconds');
    n = parseInt(secCounter.value);
    n += val;
    secCounter.value = n.toString();
    secMinMax(secCounter);
}

// Add & Subtract from Minute Counter Field
function updateMin(val) {
    minCounter = document.getElementById('counter-minutes');
    n = parseInt(minCounter.value);
    n += val;
    minCounter.value = n.toString();
    minMinMax(minCounter);
}

// Add & Subtract from Hour Counter Field
function updateHour(val) {
    hourCounter = document.getElementById('counter-hours');
    n = parseInt(hourCounter.value);
    n += val;
    hourCounter.value = n.toString();
    hourMinMax(hourCounter);
}


// PRESS AND HOLD FUNCTIONALITY FOR ADD AND SUBTRACT BUTTONS

//Universal Element Selectors for Counter Fields
secCounter = document.getElementById('counter-seconds');
minCounter = document.getElementById('counter-minutes');
hourCounter = document.getElementById('counter-hours');

// For Second Counter Field

secTimeout = function() {
    console.log('start');
}

secCounter.mousedown = secTimeout;


// TIMER FUNCTIONALITY CODE GOES HERE :-

var started = false;
var timeBackup = 0;
var yaySound = new Audio('../yay.mp3');

// Reset Button Functionality

function reset() {
    secCounter = document.getElementById('counter-seconds');
    minCounter = document.getElementById('counter-minutes');
    hourCounter = document.getElementById('counter-hours');
    
    if (started) {    // Stop Timer if Started Already
        startstop();
    }

    if (lastChanged) {    // Reset to Zero if Last Action was Changing Time
        secCounter.value = '0';
        minCounter.value = '0';
        hourCounter.value = '0';

        timeBackup = 0;
    } else {    // Otherwise Reset to Backup Time
        secs = timeBackup % 60
        mins = Math.floor(timeBackup / 60);
        hours = Math.floor(mins / 60);
        mins = mins % 60;

        secCounter.value = secs.toString();
        minCounter.value = mins.toString();
        hourCounter.value = hours.toString();

        lastChanged = true;    // Change Last Action to Changing Time
    }
}

// Start-Stop Button Functionality

function startstop () {
    secCounter = document.getElementById('counter-seconds');
    minCounter = document.getElementById('counter-minutes');
    hourCounter = document.getElementById('counter-hours');

    sec = parseInt(secCounter.value);
    min = parseInt(minCounter.value);
    hour = parseInt(hourCounter.value);

    if (lastChanged) {    // If Last Action was Changing Time, then Update Time Backup, Otherwise Ignore
        timeBackup = hour*3600 + min*60 + sec;
    }

    if (!started) {    // If Not Started Already, Change Last Action to Not Changing Time
        lastChanged = false;

        //Display Text and Images
        document.getElementById('cat-img').src = '../cat2_open_mouth.png';
        textBubble('Lets Go! You Can Do It!', 3000);
        setTimeout(() => {
            document.getElementById('cat-img').src = '../cat2_idle.png';
        }, 3000);
    }

    started = !started;    // Change Started to Stopped or Vice Versa

    // Change Icon of StartStop Button
    if (started) {
        document.getElementById('control-startstop').innerHTML = '⏸︎';
    } else {
        document.getElementById('control-startstop').innerHTML = '►';
    }
}


//  Timer Countdown

setInterval(() => {
    secCounter = document.getElementById('counter-seconds');
    minCounter = document.getElementById('counter-minutes');
    hourCounter = document.getElementById('counter-hours');
    
    if (started) {    // Only Run if Timer Started
        if (parseInt(secCounter.value) > 0) {
            secCounter.value = (parseInt(secCounter.value) - 1).toString();
        } else if (parseInt(minCounter.value) > 0) {
            secCounter.value = "59";
            minCounter.value = (parseInt(minCounter.value) - 1).toString();
        } else if (parseInt(hourCounter.value) > 0) {
            secCounter.value = '59';
            minCounter.value = '59';
            hourCounter.value = (parseInt(hourCounter.value) - 1).toString();
        } else {    // Stop Timer and Display Images and Text if Timer Runs Out
            startstop();
            t = setInterval(() => {
                yaySound.play();
            }, 500);
            setTimeout(() => {
                clearTimeout(t);
            }, 6400);
            document.getElementById('cat-img').src = '../cat2_open_mouth.png';
            textBubble('Woohooo! You Did It! Yay! I\'m So Proud Of You!',6400)
            setTimeout(() => {
                document.getElementById('cat-img').src = '../cat2_smile.png';
            }, 400);
            setTimeout(() => {
                document.getElementById('cat-img').src = '../cat2_idle.png';
            }, 6000);
        }
    }
}, 1000);

// Motivational Dialogues
setInterval(() => {
    dialogues = ['Keep Going! You Can Do It!', 'Keep Pushing! C\'mon! I Believe In You!', 'You\'re A Lot Closer To Your Goals, Keep Pushing!', 'The Kind Of Hard Work You\'re Doing Is Inspirational, Keep It Up!']
    if (started) {
        document.getElementById('cat-img').src = '../cat2_open_mouth.png';
        text = dialogues[Math.floor(Math.random() * dialogues.length)];
        document.getElementById('cat-img').src = '../cat2_open_mouth.png';
        textBubble(text, 4500);
        setTimeout(() => {
            document.getElementById('cat-img').src = '../cat2_idle.png';
        }, 4500);
    }
}, 1000*60*5);


// CODE FOR TASKS FUNCTIONALITY

function addTask() {   // Create New Task
    tasks = document.getElementById('tasks');
    addTaskBtn = document.getElementById('add-task');

    newTask = document.createElement('div');    // New Task Element
    newTask.className = 'task';

    newTaskName = document.createElement('input');    // Name of New Task Element
    newTaskName.className = 'task-name';
    newTaskName.type = 'input';
    newTaskName.placeholder = 'Enter Task Details Here';
    newTaskName.spellcheck = false;
    newTaskName.disabled = false;
    newTaskName.value = '';
    newTaskName.addEventListener('blur', (e) => {    // Change to Uneditable if Clicked Outside
        e.target.disabled = true;
    });
    newTaskName.addEventListener('keyup', (e) => {    // Change to Uneditable if Enter Pressed
        if (e.keyCode == 13) {
            e.target.disabled = true;
        }
    });

    newTaskBtnRemove = document.createElement('button');    // Task Remove BUtton
    newTaskBtnRemove.className = 'task-remove';
    newTaskBtnRemove.addEventListener('click', (e) => {    // Remove Task if Clicked
        e.target.parentElement.remove();
        textBubble('It\'s Okay! You\'ll Finish Another Task Soon Enough', 4000);
    });

    newTaskBtnEdit = document.createElement('button');    // Task Edit Button
    newTaskBtnEdit.className = 'task-edit';
    newTaskBtnEdit.addEventListener('click', (e) => {    // Change Task Name to Editable and Focus if Clicked
        children = e.target.parentElement.childNodes;
        inputField = null;
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName == 'INPUT') {
                inputField = children[i];
                break;
            }
        }
        inputField.disabled = false;
        inputField.focus();
    });

    newTaskBtnDone = document.createElement('button');    // Task Finish Button
    newTaskBtnDone.className = 'task-done';
    newTaskBtnDone.addEventListener('click', (e) => {    // Remove Task and Display Imaged if Clicked

        e.target.parentElement.remove();
        t = setInterval(() => {
            yaySound.play();
        }, 500);
        setTimeout(() => {
            clearTimeout(t);
        }, 4500);
        document.getElementById('cat-img').src = '../cat2_open_mouth.png';
        textBubble('Woohooo! You Did It! Yay! I\'m So Proud Of You!', 4500)
        setTimeout(() => {
            document.getElementById('cat-img').src = '../cat2_smile.png';
        }, 500);
        setTimeout(() => {
            document.getElementById('cat-img').src = '../cat2_idle.png';
        }, 4000);
    });

    addTaskBtn.insertAdjacentElement('afterend', newTask);    // Insert Task Just After Add Task Button

    // Insert Name and Buttons
    newTask.appendChild(newTaskName);
    newTask.appendChild(newTaskBtnRemove);
    newTask.appendChild(newTaskBtnEdit);
    newTask.appendChild(newTaskBtnDone);

    newTaskBtnRemove.innerHTML = '❌';
    newTaskBtnEdit.innerHTML = '📝';
    newTaskBtnDone.innerHTML = '✅';

    newTaskName.focus();

    // Display Images After Task is Added
    document.getElementById('cat-img').src = '../cat2_open_mouth.png';
    textBubble('Another Task Already?! I\'m Impressed!', 4000);
    setTimeout(() => {
        document.getElementById('cat-img').src = '../cat2_idle.png';
    }, 4000);
}

function removeSelf(elem) {
    elem.parentElement.remove();
}



// TEXT BUBBLE

function textBubble(text, duration) {
    console.log('Called')
    document.getElementById('text-bubble-text').innerHTML = text;
    document.getElementById('text-bubble').style.display = 'block';

    setTimeout(() => {
        document.getElementById('text-bubble-text').innerHTML = '';
        document.getElementById('text-bubble').style.display = 'none';
        console.log('Finished')
    }, duration);
}