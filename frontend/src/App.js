import logo from "./logo.svg";
import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        completed: false,
        title: "",
      },
      editing: false,
    };

    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.strikeUnstrike = this.strikeUnstrike.bind(this);
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    console.log("fetching.....");

    //enter api link here 16:20
    fetch("http://127.0.0.1:8000/api/task-list/")
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          todoList: data,
        })
      );
  }

  handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("ITEM:", this.state.activeItem);

    var csrftoken = this.getCookie("csrftoken");

    var url = "http://127.0.0.1:8000/api/task-create/";

    if (this.state.editing == true) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/` //got at 40.30
      this.setState({
        editing: false,
      });
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((response) => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            completed: false,
            title: "",
          },
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  startEdit(task) {
    this.setState({
      activeItem: task,
      editing: true,
    });
  }

  deleteItem(task) {
    var csrftoken = this.getCookie("csrftoken");

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      //go to 42.20
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      this.fetchTasks();
    });
  }

  strikeUnstrike(task) {
    task.completed = !task.completed;

    var csrftoken = this.getCookie("csrftoken");
    var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`; // go to 48.14

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ completed: task.completed, title: task.title }),
    }).then(() => {
      this.fetchTasks();
    });
    console.log("TASK:", task.completed);
  }

  render() {
    var tasks = this.state.todoList;
    var self = this;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form" onSubmit={this.handleSubmit}>
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    className="form-control"
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Add task"
                    value={this.state.activeItem.title}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    className="btn btn-warning"
                    id="submit"
                    type="submit"
                    name="Add"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="list-wrapper">
            {tasks.map(function (task, index) {
              return (
                <div key={index} className="task-wrapper flex-wrapper">
                  <div
                    onClick={() => self.strikeUnstrike(task)}
                    style={{ flex: 7 }}
                  >
                    {task.completed == false ? (
                      <span>{task.title}</span>
                    ) : (
                      <strike>{task.title}</strike>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.startEdit(task)}
                      className="btn btn-sm btn-outline-info"
                    >
                      Edit
                    </button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button
                      className="btn btn-sm btn-outline-dark delete"
                      onClick={() => self.deleteItem(task)}
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

//check matter 16:20 connectivity api calls
// 17:20 installation of django not showing files
