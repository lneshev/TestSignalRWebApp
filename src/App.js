import React from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import "./App.css";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			connection: null,
		};
	}

	startSignalR = async () => {
		let connection = new signalR.HubConnectionBuilder()
			.withUrl("https://localhost:44318/signalr")
			.withAutomaticReconnect()
			.withHubProtocol(new signalR.JsonHubProtocol())
			.configureLogging(signalR.LogLevel.Information)
			.build();

		connection.on("test", function (arg) {
			console.log("On test executed. Data: ");
			console.log(arg);
		});

		connection
			.start()
			.then(() => {
				console.log("SignalR connection established successfuly.");
			})
			.catch((err) => {
				console.log("SignalR connection error.");
			});

		await this.setState({
			connection: connection
		});
	};

	async componentDidMount() {
		await this.startSignalR();
	}

	componentWillUnmount() {
		this.state.connection.stop();
	}

	async handleClick() {
		console.log("Initiate request to back-end...");
		const result = await axios.get("https://localhost:44318/weatherforecast");
		console.log("Successful response from back-end.");
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<button type="button" onClick={this.handleClick}>
						Click to test SignalR
					</button>
					<div className="info">
						The goal is to see this message: "Hi! SignalR works!" in the console, when you click the button.
					</div>
				</header>
			</div>
		);
	}
}

export default App;
