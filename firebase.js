var firebaseConfig = {
	apiKey: "AIzaSyDNVUJX7pGPOUDQpS4Ryj6Jvof4XPcZXa8",
	authDomain: "deep-guide-web.firebaseapp.com",
	databaseURL: "https://deep-guide-web-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "deep-guide-web",
	storageBucket: "deep-guide-web.appspot.com",
	messagingSenderId: "125247287280",
	appId: "1:125247287280:web:916789f528a543de0d3735"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Adds the rounds by name and round
function pushSortedRecord(name, num, obj){
	firebase.database().ref(`sorted/${name}/${num}/`).set(obj)
}

//Adds the round to the unsorted pile. Using push gives it a hash already
function pushUnsorted(obj){
	firebase.database().ref('unsorted').push(record)
}

//Calls both by using the parameters for the sorted one and then adding them to the object before pushing to unsorted
function pushBoth(name, num, obj){
	firebase.database().ref(`sorted/${name}/${num}/`).set(obj);
	obj.name = name;
	obj.totalRounds = num;
	firebase.database().ref('unsorted/').push(obj);
}

//Increases both the packs metrics and the overall metrics.
//Metrics record how many people go to which round
function incMetric(pack, round){
	//firebase.database().ref(`metric/${rounds}/${num}/`).set(obj);
	const updates = {};
	updates[`metrics/${pack}/${round}/`] = firebase.database.ServerValue.increment(1);
	updates[`metrics/all/${round}/`] = firebase.database.ServerValue.increment(1);
	firebase.database().ref().update(updates);
}

//Retrieves an array of metrics, and applies func to them.
function getMetrics(name, func){
	firebase.database().ref(`metrics/${name}`).get().then((snapshot) => {
		if (snapshot.exists()) {
			func(snapshot.val())
		} else {
			console.log("No pack with name : " + name);
			return 'else';
		}
		}).catch((error) => {
		console.error(error);
		return 'error';
	});
}

//To prevent veryfying if each soundpack has a metrics, this sets up 15 elements with 0 values.
//If this isnt run then the graph will look very weird/maybe break
function addMetrics(name, upperExc=21){
	for(let i = 1; i < upperExc; i++){
		firebase.database().ref(`metrics/${name}/${i}/`).set(0);
		console.log(`metrics/${name}/${i}/`);
	}
}
