
var greeting=['Hello','నమస్కారం','नमस्ते','வணக்கம்','ഹലോ','Hola','Ciao'];
var num=0;

setInterval(greetings,500);

function greetings(){
    if(window.innerWidth>1007){
        document.getElementById("mySidepanel").style.width = "99%";
    }
    if(num>6){
        num=num-7;
    }
    document.getElementById("greetings").innerHTML=greeting[num];
    num++;
}

function openNav() {
    if(window.innerWidth<1007){
        document.getElementById("mySidepanel").style.width = "250px";
    }
}

function closeNav() {
    if(window.innerWidth<1007){
        document.getElementById("mySidepanel").style.width = "0";
    }
}

function toggleDarkMode(){
    document.body.classList.toggle('dark-mode');
}

function initializeLikes(blogIdentifier) {
    let likeCount = parseInt(localStorage.getItem(`likeCount_${blogIdentifier}`)) || 0;
    document.getElementById('like-count').innerText = likeCount;

    document.getElementById('like-btn').addEventListener('click', () => {
        likeCount++;
        localStorage.setItem(`likeCount_${blogIdentifier}`, 70+likeCount%2);
        document.getElementById('like-count').innerText = 70+ likeCount%2;
        const likelogo = document.getElementById('likelogo');
        if (likeCount % 2 === 1) {
            likelogo.classList.remove('fa-thumbs-down');
            likelogo.classList.add('fa-thumbs-up');
        } else {
            likelogo.classList.remove('fa-thumbs-up');
            likelogo.classList.add('fa-thumbs-down');
        }
    });
    const likelogo = document.getElementById('likelogo');
    if (likeCount % 2 === 1) {
        likelogo.classList.remove('fa-thumbs-down');
        likelogo.classList.add('fa-thumbs-up');
    } else {
        likelogo.classList.remove('fa-thumbs-up');
        likelogo.classList.add('fa-thumbs-down');
    }
}

function initializeComments(blogIdentifier) {
    let comments = JSON.parse(localStorage.getItem(`comments_${blogIdentifier}`)) || [];
    const commentsList = document.getElementById('comments-list');

    comments.forEach(comment => {
        const li = document.createElement('li');
        li.textContent = comment;
        commentsList.appendChild(li);
    });

    document.getElementById('add-comment-btn').addEventListener('click', () => {
        const commentInput = document.getElementById('comment-input');
        const newComment = commentInput.value.trim();

        if (newComment !== '') {
            comments.push(newComment);
            localStorage.setItem(`comments_${blogIdentifier}`, JSON.stringify(comments));

            const li = document.createElement('li');
            li.textContent = newComment;
            commentsList.appendChild(li);

            commentInput.value = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const blogIdentifier = document.body.getAttribute('data-blog-identifier');

    if (blogIdentifier) {
        initializeLikes(blogIdentifier);
        initializeComments(blogIdentifier);
    }
});
