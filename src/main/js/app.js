'use strict';

// tag::vars[]
import React from 'react'
import ReactDOM from 'react-dom'
import client from './client'
import CreateDialog from './CreateDialog'

// end::vars[]
const root = '/api'
// tag::app[]
class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {employees: []}
	}

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
    }

    loadFromServer(pageSize) {
        follow(client, root, [
            {rel: 'employees', params: {size: pageSize}}]
        ).then(employeeCollection => {
            return client({
                method: 'GET',
                path: employeeCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return employeeCollection;
            });
        }).done(employeeCollection => {
            this.setState({
                employees: employeeCollection.entity._embedded.employees,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: employeeCollection.entity._links});
        })
    }

    onCreate(newEmployee) {
        follow(client, root, ['employees']).then(employeeCollection => {
            return client({
                method: 'POST',
                path: employeeCollection.entity._links.self.href,
                entity: newEmployee,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(response => {
            return follow(client, root, [
                {rel: 'employees', params: {'size': this.state.pageSize}}]);
        }).done(response => {
            if (typeof response.entity._links.last != "undefined") {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        });
    }

	render() {
		return (
			<EmployeeList employees={this.state.employees}/>
		)
	}
}
// end::app[]

// tag::employee-list[]
class EmployeeList extends React.Component{
	render() {
		const employees = this.props.employees.map(employee =>
			<Employee key={employee._links.self.href} {...employee} />
		)
		return (
			<table>
				<tbody>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Description</th>
					</tr>
					{employees}
				</tbody>
			</table>
		)
	}
}
// end::employee-list[]

// tag::employee[]
class Employee extends React.Component{
	render() {
		return (
			<tr>
				<td>{this.props.firstName}</td>
				<td>{this.props.lastName}</td>
				<td>{this.props.description}</td>
			</tr>
		)
	}
}
// end::employee[]

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]

