// React
import React from 'react';

// CSS
import './App.css';

// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';

// Our components
import AppHeader from './AppHeader';

function App() {
	return (
		<React.Fragment>
			<CssBaseline />
			<AppHeader />
		</React.Fragment>
	);
}

export default App;