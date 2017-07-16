  var request = require("request");
  var admin = require("firebase-admin");
  var https = require('https');
  const async = require('async');
  var serviceAccount = require("./nodejs-a3a07-firebase-adminsdk-hx4cb-24e337ad8c.json");


  //------- initialize Firebase DB -----------//
  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodejs-a3a07.firebaseio.com"
  });

  //------- Constants & Variables -----------//
  let accessToken = 'access_token=301801280168696|FDzuXZs_Mio_vtBjPvH-fYcBglU'
  var param = 'events?fields=name,start_time,cover,end_time,place,description&since=now&' + accessToken;
  var url = 'https://graph.facebook.com'
  // full url -> 'https://graph.facebook.com/Ubuntu.Iraq/events?fields=name,start_time,end_time,place,description&since=now&access_token=301801280168696|FDzuXZs_Mio_vtBjPvH-fYcBglU')
  var urls = [
    url + '/annoorschool/' + param,
    url + '/windsormosque/' + param,
    url + '/wiyouthcouncil/' + param,
    url + '/WindsorIslamicC/' + param,
    url + '/MAC.RCIC/' + param,
    url + '/qabeelahittihaadwindsor/' + param,
    url + '/AlHijraAcademy/' + param,
    url + '/Ubuntu.Iraq/' + param
  ];

  //------- Grab JSON from multiple URls and save it in one array -----------//

  // TODO: Fix this to remove data

  function httpGet(url, callback) {

      const options = {
        url :  url,
        json : true
      };

      request(options,
        function(err, res, body) {
          callback(err, body);
        }
      );
  }

  // --------------- Main Stuff ------------------ //
  //------- Read from each slot in the array -----------//
  async.map(urls, httpGet, function (err, res){
    if (err) return console.log(err);

    // 1-
    // var jsonData = removePaging(res)

    // 2-
    accessFirebaseDataBase(res);
  });

  // **************************************************************************//
  // - 1 - remove 'paging' from json before saving to db-
  // **************************************************************************//

  // function removePaging(res){
  //   // console.log(res.length);
  // for (var i = 0; i< res.length; i++) {
  //   delete res[i].paging;
  //   }
  // return res;
  // }

  // **************************************************************************//
  // - 2 - Connect to Database & read from <path>
  // **************************************************************************//
    function accessFirebaseDataBase(jsonData) {

      // -- 3 --
      var jsonWithNoDups = checkForMultipleHost(jsonData)
      //  console.log("now data " + jsonWithNoDups[1].data[0].name);
      var ref = admin.database().ref("server/events");
      ref.once("value", function(snapshot) {
       if (snapshot.val() !== null) {

        // -- 4 --
           readFromFirebase(jsonWithNoDups);

     } else {

        // -- 5 --
           noDataExist(jsonWithNoDups)
        }
      });
    }

  // **************************************************************************//
  //  - 3 - check if two pages are hosting similar events and delete 1 from json
  // **************************************************************************//
  function checkForMultipleHost(jsonData) {
  // for ()
    var m = i + 1
    // ******************** //
    // reading every page
    // ******************** //
    for (var i = 0; i < jsonData.length-1; i++){
    //  var m = i + 1
    // console.log("i is " + i);
      console.log(jsonData[i]);

      // ************************************************** //
      // reading inside of each page (each events)
      // ************************************************* //
      for (var j = 0; j < jsonData[i].data.length; j++) {
        var m = i + 1
        // console.log(jsonData[m].data.length);

        // ******************** *************************//
        // reading event + 1 to comapre with previous
        // ******************** *************************//
        if (jsonData[m].data.length > 0) {
      //  console.log("here");
        //console.log(i + " " + j);
        // console.log("value is " + jsonData[m].data[j].id);
        if (jsonData[i].data[j].id === jsonData[m].data[j].id){
        // var m = i+1
          // console.log("Found dups at index" + i + " " + j);

          // *********************************************************//
          // delete the duplicated event from JSON then save to db
          // *********************************************************//
          delete jsonData[i].data[j];

          // console.log("data json is " + jsonData[i].data[j].name);
          }
        }
      }
    }
    return jsonData
  }

  // *****************************************************************//
  //  - 4 - Write Data to Database -----------
  // *****************************************************************//
  function readFromFirebase(jsonData) {
    console.log("Calling readFromFirebase");

    var exist = false;
    var counter = 0;
    var index = 0;
    // var db = admin.database();
    // var refOk = db.ref("server");
    var ref123 = admin.database().ref("server/events");

    // console.log("jsonData.length " + jsonData.length);
    //console.log("jsonData[i].length " + jsonData[0].length);
  // Loop the JSON values
    for (var i=0; i < jsonData.length; i++){
      // console.log("i is " + i);
      // console.log(jsonData[i].data.length);
      // console.log("jsonData[i].length is " + jsonData[i].length);
      for (var j = 0; j < jsonData[i].data.length; j++) {

      //   console.log("inside for-loop");
      //   console.log("jsonData.length is " + jsonData[i].data[j]);
      //   console.log("out j is " + j);

      // - 4 - A -
      checkForDupsInsideDB(jsonData, i, j, jsonData[i].data[j].id);
      }
      // console.log("out of loop j");
      }

  // *******************************************************************************//
  //  - 4 - A - if new event dones't have same {id} of event in Database --> save
  // ******************************************************************************//
  function checkForDupsInsideDB(jsonData, i, j, id){
    // console.log("Checking user for id " + id);
    // console.log(i + "/data");
    ref123.orderByChild("id").equalTo(id).once("value", function(snapshot) {
          var userData = snapshot.val();
          //console.log("inside index is " + index);
          //console.log("DB value is = " + userData[index].name);
          //console.log("jsonData value is = " + id);
          if (userData){
            console.log("checkForDupsInsideDB: Event exist");

            // console.log("exists!");
            // console.log("inside index is " + i);

            // ------- [Object object] -> use stringfy to parse it
            //console.log("DB value is = " + JSON.stringify(userData));


            //console.log("test 123 " + Object.values( userData.id));
            //console.log("test" + Object.values( userData));

            // ------- undefined
            // console.log("DB value is = " + userData.id);

            // ------- Undefined
            // console.log("DB value is = " + userData[i]);

            // ------- Error
            // console.log("DB value is = " + userData[j].id);

          } else {
            console.log("checkForDupsInsideDB: event doesn't exist in Database");
          //  console.log(jsonData.data[0].id);

          // - 4 - B -
            addUnderNameFOrNotifications(jsonData,i,j);
          // - 4 - C -
            //saveToFirebase(jsonData, i,j);

            addNewEvent(jsonData,i,j);
          }
      });
    }
  }

  // *****************************************************************//
  // - 4 - B - This is used to save name in a different node, why ? to use FCM
  // *****************************************************************//
  function addUnderNameFOrNotifications(jsonData,i,j) {

    var ref = admin.database().ref("server/name/");
    ref.child(jsonData[i].data[j].id).set(jsonData[i].data[j].name, function(error) {
    if (error) {
      console.log("addUnderNameFOrNotifications: Name of event could not be saved." + error);
    } else {
      console.log("addUnderNameFOrNotifications: Name of event saved successfully.");
    }
  });
  }

  function addNewEvent(jsonData,i,j) {

    var ref345 = admin.database().ref("server/events/");
    var usersRef = ref345.child(jsonData[i].data[j].id);
    usersRef.set(jsonData[i].data[j], function(error) {
    if (error) {
      console.log("addNewEvent: Name of event could not be saved." + error);
    } else {
      console.log("addNewEvent: Name of event saved successfully.");
    }
  });
  }

  // *****************************************************************//
  //  - 4 -  C - Write Data to Database -----------
  // *****************************************************************//
  // function saveToFirebase (jsonData,i,j){
  //  console.log("Calling saveToFirebase");
  //  //console.log(jsonData);
  //  // var db = admin.database();
  //  var ref345 = admin.database().ref("server/events/" + i + "/data");
  //   var usersRef = ref345.child(j);
  //   // console.log(jsonData[i].data[j]);
  //
  // console.log("first value");
  // // console.log(jsonData[i].data[j].description);
  //
  //  // if (jsonData[i].data[j].description){
  //  //
  //  // } else {
  //  //   console.log("Doesn't exist");
  //  // }
  //
  //  if (jsonData[i].data[j].name && jsonData[i].data[j].place && jsonData[i].data[j].cover && jsonData[i].data[j].description) {
  //
  //     usersRef.set(jsonData[i].data[j], function(error) {
  //         if (error) {
  //           console.log("saveToFirebase: Data could not be saved." + error);
  //         } else {
  //           console.log("saveToFirebase: Data saved successfully.");
  //         }
  //     });
  //
  //   } else {
  //     console.log("Missing some info on the events page");
  //   }
  // }

  // *********************************************************//
  // - 5 - if db is empty, this func will be called:
  // *********************************************************//
  function noDataExist(jsonData) {
    console.log("calling noDataExist");
    // var db = admin.database();
    var ref = admin.database().ref("server");
    var nameRef = ref.child("name");
    for (var i = 0; i < jsonData.length; i++){
      for (var j = 0; j < jsonData[i].data.length; j++) {
        // console.log(jsonData[i].data[j].name);
        // nameRef.child(i).child(j).set(jsonData[i].data[j].name)
        addNewEvent(jsonData,i,j);
        addUnderNameFOrNotifications(jsonData,i,j);
    }
  }
    console.log("leaving noDataExist");
  }

  console.log("Reached End of app");
