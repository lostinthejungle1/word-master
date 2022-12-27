let squareNum = 1;
let rowNum = 1;


const btn = document.querySelector("#btn");
btn.addEventListener("click",async function(){
    const promise = await fetch("https://words.dev-apis.com/word-of-the-day");
    const response = await promise.json();
    console.log(response);
})
const postBtn = document.querySelector("#post-btn");
postBtn.addEventListener("click",async function(){
    const promise = await fetch("https://words.dev-apis.com/validate-word",{
        method:"POST",
        body:JSON.stringify({word:"aaaaa"})
    });
    const response = await promise.json();
    console.log(response);
})

document.addEventListener("keydown",async event=>{
    console.log(event.code)
    console.log(isLetter(event.key))
    if(isLetter(event.key))
    {
        if(squareNum <= 5)
        {
            const square = document.querySelector(`.row${rowNum}>.square:nth-child(${squareNum++})`);
            square.innerHTML = event.key;   
        }
    }else if(isBackspare(event.key)){
        if(squareNum > 1){
            squareNum--;
            const square = document.querySelector(`.row${rowNum}>.square:nth-child(${squareNum})`);
            square.innerHTML = "";
        }
    }else if(isEnter(event.key))
    {
        if(squareNum > 5)
        {
            const word = getRowWord();
            const result = await isWord(word);
            console.log(result);
            if(result)
            {
                alert("yes it is a valid word");
                const todayWord = await getTodayWord()
                if(!compareWords(todayWord)){
                    rowNum++;
                    squareNum=1;
                }
            }else{
                //change the color
                alert("what u input is not a valid word, plz reinput");
            }
        }
    }
})

function isLetter(letter)
{
    return /^[a-zA-Z]$/.test(letter);
}

function isBackspare(code)
{
    return code === "Backspace";
}

function isEnter(code)
{
    return code === "Enter";
}

async function isWord(word)
{
    const promise = await fetch("https://words.dev-apis.com/validate-word",
    {method:"POST",body:JSON.stringify({"word":word})});
    const response = await promise.json();
    return response.validWord;
}

function getRowWord()
{
    let word = "";
    for(let i = 1; i <= 5; i++)
    {
        let square = document.querySelector(`.row${rowNum}>.square:nth-child(${i})`);
        word += square.innerHTML;
    }
    console.log(word);
    return word;
}

async function getTodayWord()
{
    const promise = await fetch("https://words.dev-apis.com/word-of-the-day?puzzle=1337");
    const response = await promise.json();
    console.log(response);
    return response.word;
}

function compareWords(todayWord)
{
    let used = [false,false,false,false,false];
    for(let i=1;i<=5;i++)
    {
        let square = document.querySelector(`.row${rowNum}>.square:nth-child(${i})`);
        let char = square.innerHTML;
        if(todayWord.charAt(i-1)===char)
        {
            square.style.backgroundColor = 'green';
            square.style.color = 'white';
            used[i-1]=true;
        } else 
        {
            square.style.backgroundColor = 'grey';
            square.style.color = 'white';
        }
    }
    if(used.every(e=>e)){
        alert("correct");
        return true;
    }
    for(let i=1;i<=5;i++)
    {
        let square = document.querySelector(`.row${rowNum}>.square:nth-child(${i})`);
        let char = square.innerHTML;
        if(todayWord.indexOf(char)!==-1&&!used[i-1])
        {
            let index = todayWord.indexOf(char);
            let str;
            while(used[index]&&index!==-1)
            {
                str = todayWord.substring(index +1);
                index = str.indexOf(char);
                console.log("test");
            }
            if(index!==-1)
            {
                square.style.backgroundColor = 'orange';
                square.style.color = 'white';
                used[index] = true;
            }else
            {
                square.style.backgroundColor = 'grey';
                square.style.color = 'white';
            }
        }
    }
    return false;
}

function makeMap(arr)
{
    let obj = {};
    for(let i = 0; i < arr.length;i++)
    {
        const letter = arr[i];
        if(obj[letter]){
            obj[letter]++;
        }else{
            obj[letter] = 1;
        }
    }
    return obj;
}
