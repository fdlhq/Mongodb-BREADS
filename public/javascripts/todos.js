let id = null, 
  title = '',
  deadline = '',
  startdateDeadline = '',
  enddateDeadline = '',
  complete = '',
  page = 1,
  keyword = '',
  limit = 10,
  sortBy = '_id',
  sortMode = 'desc',
  show = false;

function getId(_id) {
  id = _id;
}

// let button = document.getElementById('mybutton')
// button.onclick = () => {
//     condition ? addData() : editData()
// }

// const addButton = document.getElementById('addButton');
// addButton.onclick = () => {
//     condition = true;
//     clearInputs();
// };

// const sortNameAsc = (name) => {
//   sortBy = 'name'
//   sortMode = 'asc'
//   let phoneSort = `<a type="button" onclick="sortPhoneAsc('name')"><i class="fa-solid fa-sort"></i></a> Phone</th>`
//   let sortAsc = `
//   <a type="button" onclick="sortNameDesc('name')"><i class="fa-solid fa-sort-up"></i></a>
//   <span>Name</span>
//   `
//   document.getElementById(`sort-name`).innerHTML = sortAsc
//   document.getElementById(`sort-phone`).innerHTML = phoneSort
//   readData()
// }

// const sortNameDesc = (name) => {
//   sortBy = 'name'
//   sortMode = 'desc'
//   let sortDesc = `
//   <a type="button" onclick="sortNameAsc('name')"><i class="fa-solid fa-sort-down"></i></a>
//   <span>Name</span>
//   `
//   document.getElementById(`sort-name`).innerHTML = sortDesc
//   readData()
// }

// const sortPhoneAsc = (phone) => {
//   sortBy = 'phone'
//   sortMode = 'asc'
//   let phoneSort = `<a type="button" onclick="sortPhoneAsc('name')"><i class="fa-solid fa-sort"></i></a> Phone</th>`
//   let sortAsc = `
//   <a type="button" onclick="sortPhoneDesc('phone')"><i class="fa-solid fa-sort-up"></i></a>
//   <span>Phone</span>
//   `
//   document.getElementById(`sort-phone`).innerHTML = sortAsc
//   document.getElementById(`sort-name`).innerHTML = phoneSort
//   readData()
// }

// const sortPhoneDesc = (phone) => {
//   sortBy = 'phone'
//   sortMode = 'desc'
//   let sortDesc = `
//   <a type="button" onclick="sortPhoneAsc('phone')"><i class="fa-solid fa-sort-down"></i></a>
//   <span>Phone</span>
//   `
//   document.getElementById(`sort-phone`).innerHTML = sortDesc
//   readData()
// }

const browseData = () => {
    page = 1
    title = $('#searchTitle').val()
    startdateDeadline = $('#startdateDeadline').val()
    enddateDeadline = $('#enddateDeadline').val()
    if ($('#completeTodo').val()) complete = $('#completeTodo').val()
    else complete = ''
    readData(!show)
}

// const browse = () => {
//   const name = document.getElementById('name').value
//   const phone = document.getElementById('phone').value
//   let inputData = document.getElementById('inputData').value
//   keyword = inputData.toString()
//   readData()
// }

// const clearInputs = () => {
//   document.getElementById('name').value = "";
//   document.getElementById('phone').value = "";
// };

// const formUser = document.getElementById('form-user');
// formUser.addEventListener('submit', (event) => {
//     event.preventDefault();
//     condition ? addData() : editData();
//     readData();
//   });

//   const chooselimit = () => {
//     limit = document.getElementById('showData').value
//     page = 1
//     readData()
// }

// const changePage = async (num) => {
//     page = num
//     readData(page)
// }


const readData = async (tampil) => {
    try {
        const todos = await $.ajax({
            url: `/api/todos`,
            method: "GET",
            dataType: "json",
            data: {
                executor,
                sortBy,
                sortMode,
                deadline,
                title,
                startdateDeadline,
                enddateDeadline,
                complete,
                page,
                limit
            }
        })
        let list = ''
        todos.data.forEach((item, index) => {
            list += `
        <div id="${item._id}" class="inner-nav ${item.complete == false && new Date(`${item.deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : item.complete == true ? ' alert alert-success' : ' alert alert-secondary'}" role="alert">
              ${moment(item.deadline).format('DD-MM-YYYY HH:mm')} ${item.title}
            <div>
            <a type="button" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
            <a type="button" onclick="getId('${item._id}')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
            </div>
        </div>
        `
        })
        if (tampil == false) {
            $('#showTodos').append(list)
        } else if (tampil == true) {
            $('#showTodos').html(list)
        }

    } catch (e) {
        alert('pengambilan data gagal')
    }
}
readData(show)

const addData = async () => {
    try {
        title = $('#title').val()
        const a_day = 24 * 60 * 60 * 1000
        const todos = await $.ajax({
            url: `/api/todos`,
            method: "POST",
            dataType: "json",
            data: {
                title,
                executor
            }
        });
        let newlist = ''
        newlist += `
        <div id="${todos[0]._id}" class="inner-nav ${todos[0].complete == false && new Date(`${todos[0].deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : todos[0].complete == true ? ' alert alert-success' : ' alert alert-secondary'}" role="alert">
            ${moment(new Date(Date.now() + a_day)).format('DD-MM-YYYY HH:mm')} ${title}
            <div>
            <a type="button" onclick="getData('${todos[0]._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
            <a type="button" onclick="getId('${todos[0]._id}')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
            </div>
        </div>
        `
        $('#showTodos').prepend(newlist)
        title = ''
        $('#title').val('')
    } catch (e) {
        alert('Data gagal ditambahkan')
    }
}

const getData = async (_id) => {
    try {
        getId(_id)
        const todo = await $.ajax({
            url: `/api/todos/${_id}`,
            method: "GET",
            dataType: "json",
        });
        $('#editTitle').val(todo.title)
        $('#editDeadline').val(moment(todo.deadline).format('YYYY-MM-DDThh:mm'))
        $('#editComplete').prop('checked', todo.complete)
    } catch (e) {
        console.log(e)
        alert('tidak dapat menampilkan data')
    }
}

const editData = async () => {
    try {
        title = $('#editTitle').val()
        deadline = $('#editDeadline').val()
        complete = $('#editComplete').prop('checked')
        const a_day = 24 * 60 * 60 * 1000
        const todo = await $.ajax({
            url: `/api/todos/${id}`,
            method: "PUT",
            dataType: "json",
            data: {
                title,
                executor,
                deadline,
                complete: Boolean(complete)
            }
        });
        let newData = ''
        newData += `
        ${moment(new Date(deadline)).format('DD-MM-YYYY HH:mm')} ${title}
        <div>
        <a type="button" onclick="getData('${todo._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
        <a type="button" onclick="getId('${todo._id}')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
        </div>
        `
        $(`#${todo._id}`).attr('class', `inner-nav ${todo.complete == false && new Date(`${todo.deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : todo.complete == true ? ' alert alert-success' : ' alert alert-secondary'}`).html(newData)
        title = $('#searchTitle').val()
        if ($('#completeTodo').val()) complete = $('#completeTodo').val()
        else complete = ''

    } catch (e) {
        console.log(e)
        alert('Perubahan data gagal')
    }
}

// const getoneData = async (_id) => {
//   condition = false
//   const response = await fetch(`http://localhost:3000/api/users/${_id}`)
//   const user = await response.json();
//   getId(user._id)
//   document.getElementById('name').value = user.name
//   document.getElementById('phone').value = user.phone
// }

// const addData = async () => {
//   const name = document.getElementById('name').value
//     const phone = document.getElementById('phone').value
//     const response = await fetch("http://localhost:3000/api/users", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, phone })
//     });
//     const users = await response.json();
//     document.getElementById('name').value = ""
//     document.getElementById('phone').value = ""
//     readData()
// }

// const editData = async () => {
//   const name = document.getElementById('name').value
//   const phone = document.getElementById('phone').value
//   const response = await fetch(`http://localhost:3000/api/users/${id}`, {
//       method: "PUT",
//       headers: {
//           "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name, phone })
//   });
//   const users = await response.json();
//   document.getElementById('name').value = ""
//   document.getElementById('phone').value = ""
//   readData()
// }

// const deleteData = async () => {
//   const response = await fetch(`http://localhost:3000/api/users/${id}`, {
//       method: "DELETE",
//       headers: {
//           "Content-Type": "application/json",
//       }
//   });
//   const users = await response.json();
//   readData()
// }

const deleteData = async () => {
    try {
        const todo = await $.ajax({
            url: `/api/todos/${id}`,
            method: "DELETE",
            dataType: "json",
        })
        $(`#${id}`).remove()

    } catch (error) {

    }
}