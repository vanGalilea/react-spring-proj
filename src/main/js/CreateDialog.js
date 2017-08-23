import React from 'react'
import ReactDOM from 'react-dom'

export class CreateDialog extends React.Component {

    constructor(props) {
        super(props)
    }

    handleSubmit(e) {
        e.preventDefault()
        var newEmployee = {}
        this.props.attributes.forEach(attribute => {
            newEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim()
        })
        this.props.onCreate(newEmployee)

        // clear out the dialog's inputs
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = ''
        })

        // Navigate away from the dialog to hide it.
        window.location = "#"
    }

    render() {
        const inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input type="text" placeholder={attribute} ref={attribute} className="field" />
            </p>
        )

        return (
            <div>
                <a href="#createEmployee">Create</a>

                <div id="createEmployee" className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>

                        <h2>Create new employee</h2>

                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit.bind(this)}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}

exports default CreateDialog