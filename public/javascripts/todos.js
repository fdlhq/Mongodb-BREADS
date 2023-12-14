let id = null,
  title = "",
  deadline = "",
  startdateDeadline = "",
  enddateDeadline = "",
  complete = "",
  page = 1,
  keyword = "",
  limit = 5,
  sortBy = "_id",
  sortMode = "desc",
  reachedEnd = false;


function getId(_id) {
  id = _id;
}

const browseData = () => {
  reachedEnd = false;
  page = 1;
  title = $("#searchTitle").val();
  startdateDeadline = $("#startdateDeadline").val();
  enddateDeadline = $("#enddateDeadline").val();
  if ($("#completeTodo").val()) complete = $("#completeTodo").val();
  else complete = "";

  if (!title.trim()) {
    title = null;
  }
  
  readData()
};

const sortAsc = (deadline) => {
    reachedEnd = false;
    page = 1
    sortBy = deadline
    sortMode = 'asc'
    let ascMode = `
        <button class="btn btn-success" onclick="sortDesc('deadline')"><i class="fa-solid fa-sort-down"></i> sort by deadline</button>
    `
    $('#changeSort').html(ascMode)
    readData()
}

const sortDesc = (deadline) => {
    reachedEnd = false;
    page = 1
    sortBy = deadline
    sortMode = 'desc'
    let descMode = `
        <button class="btn btn-success" onclick="sortAsc('deadline')"><i class="fa-solid fa-sort-up"></i> sort by deadline</button>
    `
    $('#changeSort').html(descMode)
    readData()
}

const resetData = () => {
    title = ""
    startdateDeadline = ""
    enddateDeadline = ""
    complete = ""
    $("#searchTitle").val('')
    $("#startdateDeadline").val('')
    $("#enddateDeadline").val('')
    $("#completeTodo").val('')

    sortBy = "_id"
    sortMode = "desc"
    page = 1;
    reachedEnd = false;

    let defaultMode = `<button class="btn btn-success" onclick='sortDesc("deadline")'><i class="fa-solid fa-sort"></i> sort by deadline</button>`
    $('#changeSort').html(defaultMode)
    readData()
}

$(document).ready(function(){
    $(window).scroll(function() {
        if (!reachedEnd && $(window).scrollTop() >= $(document).height() - $(window).height() - 5) {
            page++;
            readData();
        }
    });
});

const readData = async () => {
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
        limit,
      },
    });
    let list = "";
    todos.data.forEach((item, index) => {
      list += `
        <div id="${item._id}" class="inner-nav ${
        item.complete == false &&
        new Date(`${item.deadline}`).getTime() < new Date().getTime()
          ? " alert alert-danger"
          : item.complete == true
          ? " alert alert-success"
          : " alert alert-secondary"
      }" role="alert">
              ${moment(item.deadline).format("DD-MM-YYYY HH:mm")} ${item.title}
            <div>
            <a type="button" onclick="getData('${
              item._id
            }')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
            <a type="button" onclick="getId('${
              item._id
            }')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
            </div>
        </div>
        `;
    });

    if (todos.data.length > 0) {
        if (page <= todos.pages) {
          if (page === 1) {
            $("#showTodos").html(list);
          } else {
            $('#showTodos').append(list);
          }
        }
      } else {
        if (page === 1) {
          $("#showTodos").html(`<p></p>`);
        } else {
          reachedEnd = true;
        }
      }
};

readData();



const addData = async () => {
  try {
    title = $("#title").val();
    const a_day = 24 * 60 * 60 * 1000;
    const todos = await $.ajax({
      url: `/api/todos`,
      method: "POST",
      dataType: "json",
      data: {
        title,
        executor,
      },
    });
    let newlist = "";
    newlist += `
        <div id="${todos[0]._id}" class="inner-nav ${
      todos[0].complete == false &&
      new Date(`${todos[0].deadline}`).getTime() < new Date().getTime()
        ? " alert alert-danger"
        : todos[0].complete == true
        ? " alert alert-success"
        : " alert alert-secondary"
    }" role="alert">
            ${moment(new Date(Date.now() + a_day)).format(
              "DD-MM-YYYY HH:mm"
            )} ${title}
            <div>
            <a type="button" onclick="getData('${
              todos[0]._id
            }')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
            <a type="button" onclick="getId('${
              todos[0]._id
            }')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
            </div>
        </div>
        `;
    $("#showTodos").prepend(newlist);
    title = "";
    $("#title").val("");
  } catch (e) {
    alert("Data gagal ditambahkan");
  }
};

const getData = async (_id) => {
  try {
    getId(_id);
    const todo = await $.ajax({
      url: `/api/todos/${_id}`,
      method: "GET",
      dataType: "json",
    });
    $("#editTitle").val(todo.title);
    $("#editDeadline").val(moment(todo.deadline).format("YYYY-MM-DDTHH:mm"));
    $("#editComplete").prop("checked", todo.complete);
  } catch (e) {
    console.log(e);
    alert("tidak dapat menampilkan data");
  }
};

const editData = async () => {
  try {
    title = $("#editTitle").val();
    deadline = $("#editDeadline").val();
    complete = $("#editComplete").prop("checked");
    const todo = await $.ajax({
      url: `/api/todos/${id}`,
      method: "PUT",
      dataType: "json",
      data: {
        title,
        executor,
        deadline,
        complete: Boolean(complete),
      },
    });
    let newData = "";
    newData += `
        ${moment(new Date(deadline)).format("DD-MM-YYYY HH:mm")} ${title}
        <div>
        <a type="button" onclick="getData('${
          todo._id
        }')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
        <a type="button" onclick="getId('${
          todo._id
        }')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
        </div>
        `;
    $(`#${todo._id}`)
      .attr(
        "class",
        `inner-nav ${
          todo.complete == false &&
          new Date(`${todo.deadline}`).getTime() < new Date().getTime()
            ? " alert alert-danger"
            : todo.complete == true
            ? " alert alert-success"
            : " alert alert-secondary"
        }`
      )
      .html(newData);
    title = $("#searchTitle").val();
    if ($("#completeTodo").val()) complete = $("#completeTodo").val();
    else complete = "";
  } catch (e) {
    console.log(e);
    alert("Perubahan data gagal");
  }
};

const deleteData = async () => {
  try {
    const todo = await $.ajax({
      url: `/api/todos/${id}`,
      method: "DELETE",
      dataType: "json",
    });
    $(`#${id}`).remove();
  } catch (error) {}
};
