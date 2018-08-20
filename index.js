import './style';
import { Component } from 'preact';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { Query, Mutation } from "react-apollo";
import './node_modules/bootstrap/dist/css/bootstrap.min.css';

const client = new ApolloClient({
	uri: "http://localhost:4000/graphql"
  });

const ADD_TODO = gql`
	mutation AddTodo($taskName: String!) {
		addTask(taskName: $taskName) {
			id
			taskName
		}
	}
`;

const GET_TODO = gql`
	query {
		allTask{
			taskName,
			id
		}
	}
`;

const DEL_TODO = gql`
	mutation DelTodo($id: Int!) {
		deleteTask(id: $id){
			id
		  }
	}
`;
class ToDoList extends Component{
	constructor(){
		super();
		this.state={
			addToDoItem:""
		}
	}
	handleChange(e){
		this.setState({ addToDoItem: e.target.value });
	}
	
	render(){
		return(
			<Query query={GET_TODO}>
			{({ loading, error, data }) => {
			  if (loading) return <p>Loading...</p>;
			  if (error) return <p>Error :(</p>;
		
			  return (
				  <div>
				  <h1 style="color:white">To Do App</h1>
				  <Mutation mutation={ADD_TODO}>
				  	{(addTask, {data}) => (
						  <div class="input-group">
						  	<input type="text" class="form-control" placeholder="ADD NEW TASK TITLE" value={this.state.addToDoItem} onChange={(e) => this.handleChange(e)}/>
							  <span class="input-group-btn">
							  <button class='btn btn-primary accordian-button' onClick={() => {
								addTask({variables: {taskName:this.state.addToDoItem},
										refetchQueries:[{query:GET_TODO}]})
								this.state.addToDoItem="";
								}}>Add New</button>
							  </span>
						 </div>
					  )}
				  </Mutation>
				  <h2> All Task </h2>
				  {
				  data.allTask.map((task) => (
					  <div style="float:left; width:100%; border:outset" key={task.id}>
						<p style="float: left; font-size: 20px">{task.taskName}</p>
						<Mutation mutation={DEL_TODO}>
							{(deleteTask, {data}) => (
								<button class="btn btn-danger accordian-button" onClick={() => {
									deleteTask({variables: {id:task.id},
												refetchQueries:[{query:GET_TODO}]})
								}}>DONE</button>	
							)}
						</Mutation>
					  </div>
					))}
				  </div>
			  )
			}}
		  </Query>
		
		)
	}
}


export default class App extends Component {
	constructor(){
		super()
	}
	render() {
		return(
			<ApolloProvider client={client}>

			<div>
			 <ToDoList />
			</div>
		  </ApolloProvider>
		)
	}
}
