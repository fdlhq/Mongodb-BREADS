let id = null, 
  title = '',
  deadline = '',
  startdateDeadline = '',
  enddateDeadline = '',
  complete = '',
  page = 1,
  keyword = '',
  limit = 5,
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


const readData = async (semua) => {
    console.log('jidji', semua)
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
        if (semua == false) {
            $('#showTodos').append(list)
        } else if (semua == true) {
            $('#showTodos').html(list)
        }

    } catch (e) {
        alert('pengambilan data gagal')
    }
}
readData(show)

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