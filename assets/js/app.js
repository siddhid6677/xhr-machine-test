const cl = console.log;
const postContainer = document.getElementById("postContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const loader = document.getElementById("loader")

const BASE_URL = `https://jsonplaceholder.typicode.com`;

const POST_URL = `${BASE_URL}/posts`;

let postArr = [];

const templating = (arr) => {
    let result = ``;

    arr.forEach(post => {
        result += `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 postCards" id="${post.id}">
                            <div class="card-header">
                                <h3>${post.title}</h3>
                            </div>
                            <div class="card-body">
                                <p>${post.body}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                                <button onclick="onDelete(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                            </div>
                        </div>
                     </div>
        
                    `
    });
    postContainer.innerHTML = result;
}

const fetchPosts = () => {

    loader.classList.remove("d-none")

    let xhr = new XMLHttpRequest();

    xhr.open("GET", POST_URL, true)

    xhr.send();

    xhr.onload = function(){
        // cl(xhr.response);
        // cl(xhr.status);
        // cl(xhr.statusText);
        if(xhr.status >= 200 && xhr.status < 300){
            postArr = JSON.parse(xhr.response);
            cl(postArr);
            templating(postArr)
        } 
        loader.classList.add("d-none")
    }
}

fetchPosts();

const onEdit = (ele) => {
    cl(ele);
    let editId = ele.closest('.card').id;
    cl(editId);

    localStorage.setItem("editId", editId);
    let EDIT_URL = `${BASE_URL}/posts/${editId}`;
    
    loader.classList.remove("d-none")

    let xhr = new XMLHttpRequest()

    xhr.open('GET', EDIT_URL);

    

    xhr.onload = function(){
        setTimeout(() => {
            if(xhr.status >= 200 && xhr.status < 300){
                cl(xhr.response)
                let post = JSON.parse(xhr.response)
                titleControl.value = post.title;
                contentControl.value = post.body;
                userIdControl.value = post.userId;
    
                updateBtn.classList.remove("d-none");
                submitBtn.classList.add("d-none");
                window.scrollTo(0,1)
            }

            loader.classList.add("d-none")
        }, 1000);
    }
    xhr.send()
}

const onPostUpdate = () => {
    let updateObj = {
        title : titleControl.value,
        body : contentControl.value.trim(),
        userId : userIdControl.value
    }
    cl(updateObj);

    let updateId = localStorage.getItem("editId");
    // cl(updateId);

    
    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`;

    loader.classList.remove("d-none");

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", UPDATE_URL);

    xhr.send(JSON.stringify(updateObj));

    xhr.onload = function(){
        setTimeout(() => {
            if(xhr.status >= 200 && xhr.status < 300){
                cl(xhr.response);

                let card = [...document.getElementById(updateId).children]

                card[0].innerHTML = `<h3>${updateObj.title}</h3>`;
                card[1].innerHTML = `<p>${updateObj.body}</p>`
    
                updateBtn.classList.add("d-none");
                submitBtn.classList.remove("d-none");
    
                postForm.reset()
            }
            loader.classList.add("d-none");
        }, 1000);
    }
}

const onDelete = (ele) => {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            let removeId = ele.closest(".card").id;
            cl(removeId)
        
            

            let REMOVE_URL = `${BASE_URL}/posts/${removeId}`
            loader.classList.remove("d-none")
            let xhr = new XMLHttpRequest()
        
            xhr.open("DELETE", REMOVE_URL);
        
            xhr.send()
        
            xhr.onload = function(){
                if(xhr.status >= 200 && xhr.status < 300){
                    ele.closest('.col-md-4').remove()
                }
                loader.classList.add("d-none")
            }
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });


}

const onPostSubmit = (eve) => {
    eve.preventDefault();

    loader.classList.remove("d-none")

    let newPost = {
        title : titleControl.value,
        body : contentControl.value.trim(),
        userId : userIdControl.value
    }
    // cl(newPost);
    postForm.reset()
    let xhr = new XMLHttpRequest()

    xhr.open("POST", POST_URL)

    xhr.send(JSON.stringify(newPost))

    xhr.onload = function(){
        // cl(xhr.response)
        if(xhr.status >= 200 && xhr.status < 300){
            // cl(xhr.response)
            newPost.id = JSON.parse(xhr.response).id;
            // postArr.unshift(newPost)
            // templating(postArr)

            let div = document.createElement(`div`);
            div.className = `col-md-4 mb-4`;
            div.innerHTML = `
            
                                <div class="card h-100 postCards" id="${newPost.id}">
                                    <div class="card-header">
                                        <h3>${newPost.title}</h3>
                                    </div>
                                    <div class="card-body">
                                        <p>${newPost.body}</p>
                                    </div>
                                    <div class="card-footer d-flex justify-content-between">
                                        <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                                        <button onclick="onDelete(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                                    </div>
                                </div>  
            
            `
            postContainer.prepend(div)
        }
        loader.classList.add("d-none")
    }
}


postForm.addEventListener("submit", onPostSubmit);
updateBtn.addEventListener("click", onPostUpdate);
