var css = document.createElement("link")
css.rel =  "stylesheet";
css.href = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css";
var icons = document.createElement("link")
icons.rel = "stylesheet";
icons.href = "https://fonts.googleapis.com/icon?family=Material+Icons"
var js = document.createElement("script")
js.type = "application/javascript"
js.src = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"
document.body.appendChild(js);
document.head.appendChild(icons)
document.head.appendChild(css)

document.getElementsByTagName("center")[0].classList = "container"

var navbarFull = document.createElement("nav")
var navbar = document.createElement("div")
navbarFull.appendChild(navbar);
navbar.className = "nav-wrapper blue lighten-2";
var logo = document.createElement("a");
logo.classList = "brand-logo center";
logo.href = "/";
logo.textContent = "A2OJ";
navbar.appendChild(logo);

var links = document.createElement("ul");
links.className = "hide-on-med-and-down right";
var laddersLink = document.createElement("li");
var ll = document.createElement("a");
ll.href="/Ladders";
ll.textContent = "Ladders";
laddersLink.appendChild(ll);
links.appendChild(laddersLink)
var categoriesLink = document.createElement("li");
var ll = document.createElement("a");
ll.href="/Categories";
ll.textContent = "Categories";
categoriesLink.appendChild(ll);
links.appendChild(categoriesLink);
var loginButton = document.createElement("li");
loginButton.id = "toggle"
var lba = document.createElement("a");
lba.textContent = "Login"
lba.id = "nav_username"
var lbi = document.createElement("i");
lbi.classList="material-icons left";
lbi.textContent = "apps";
lba.appendChild(lbi)
loginButton.appendChild(lba);
links.appendChild(loginButton)
navbar.appendChild(links)
// console.log(navbar.outerHTML)
// document.body.innerHTML = navbar.outerHTML + document.body.innerHTML;
var githubLink = document.createElement("a");
githubLink.href = "https://github.com/iakshat/a2oj-enhancer"
var img = document.createElement("img");
githubLink.classList = "left"
img.src = "https://i.imgur.com/IpGTwiU.png";
img.classList = "responsive-img circle center"
githubLink.appendChild(img);
navbar.appendChild(githubLink)

setTimeout(() => {
    document.getElementById("toggle").onclick =  (e) => {
        var loginDiv = document.getElementById("loginDiv");
        loginDiv.classList.toggle("scale-out");
        console.log("toggle login form")
    }
    document.getElementById("loginBtn").addEventListener("click", (e) => {
        login(document.getElementById("usernameInput").value);
        e.target.classList = "btn blue lighten-2";
    })
}, 1000)

document.body.innerHTML = `
    <div class="scale-transition row scale-out" id="loginDiv">
        <div class="col s12 m4 right top valign-wrapper">
            <div class="col m4 left">
                <img height="100px" id="profile_image" class="circle responsive-image" src="https://i.imgur.com/sr9nuPl.png">
                <br/>
            </div>
            <div class="col m3">
                <h5 id="username" class="bold"></h5>
                <h6 id="rating"></h6>
            </div>
            <div class="input-feld">
                <input id="usernameInput" placeholder="Codeforces Username" class="username">
                <a class="btn blue darken-3" id="loginBtn">Login</a>
            </div>
        </div>
    </div>

` + document.body.innerHTML;

document.body.insertBefore(navbarFull, document.body.firstChild)


var login = (username) => {
    console.log("Getting Data for : ", username);
    console.log(fetch)
    loadNavbar(username);
    fetch("https://codeforces.com/api/user.status?handle="+username+"&from=1&count=5000")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.status != "OK"){
                alert("Invalid Login Credentials");
                document.getElementById("loginBtn").classList = "btn blue darken-3"
            }
            else{
                document.getElementById("loginBtn").classList = "btn blue darken-3"
                console.log("Logged In");
                localStorage.setItem("username", username);
                data = data.result;
                var map = {}
                data.forEach(que => {
                    if(que.verdict === "OK"){
                        var url = que.problem.contestId.toString()+"/"+que.problem.index;
                        var submissionURL = "https://codeforces.com/contest/"+que.problem.contestId+"/submission/"+que.id;
                        map[url] = submissionURL;
                    }
                })
                // window.location.reload();
                markData(map);
            }
        })
}

var markData = (map) => {
    try{
        var table = document.getElementsByTagName("tbody")[1];
        console.log(table)
        for(var row in table.children) {
            row = table.children[row];
            try{
                var question = row.children[1].children[0].href.split("problem/")[1];
                console.log(question);
                if(map[question]){
                    row.children[1].children[0].classList = "white-text"
                    row.classList = "teal accent-4 white-text"
                    if(!row.children[3].children.length){
                        var viewSubmissionA = document.createElement("a")
                        viewSubmissionA.href = map[question];
                        var viewSubmission = document.createElement("span");
                        viewSubmission.className = "new badge black white-text";
                        viewSubmission.style.marginLeft = "20px";
                        viewSubmission.setAttribute("data-badge-caption", "View Submission")
                        viewSubmissionA.appendChild(viewSubmission)
                        row.children[3].appendChild(viewSubmissionA);
                    }
                    else{
                        var viewSubmissionA = row.children[3].children[0];
                        viewSubmissionA.href = map[question];
                    }
                }
                else{
                    row.children[1].children[0].classList = ""
                    row.classList = ""
                    if(row.children[3].children.length)
                        row.children[3].innerHTML = row.children[3].textContent;
                }
            }
            catch{
                console.log("er")
            }
        }
    }
    catch{
        console.log("not able to mark")
    }

}

var loadNavbar = (username) => {
    fetch("https://codeforces.com/api/user.info?handles="+username)
        .then(res => res.json())
        .then(res => {
            if(res.status === "OK"){
                document.getElementById("username").textContent = username;
                document.getElementById("rating").textContent = res.result[0].rating;
                document.getElementById("nav_username").textContent = username;
                var pp = document.getElementById("profile_image");
                if(res.result[0].titlePhoto !== "//userpic.codeforces.com/no-title.jpg")
                    pp.src = res.result[0].titlePhoto;
                else
                    pp.src = "https://i.imgur.com/sr9nuPl.png";
            }
        })
}

if(localStorage.getItem("username")){
    login(localStorage.getItem("username"))
}