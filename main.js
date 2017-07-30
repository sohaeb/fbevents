  var request = require("request");
  var admin = require("firebase-admin");

  
  // TODO: Fix this to remove data
  // TODO: promises
  // TODO: remove old events

  
   //------- Constants & Variables -----------//
  let accessToken = 'access_token=301801280168696|FDzuXZs_Mio_vtBjPvH-fYcBglU'
  var param = 'events?fields=name,start_time,cover,end_time,place,description&since=now&' + accessToken;
  var url = 'https://graph.facebook.com'
  // full url -> 'https://graph.facebook.com/Ubuntu.Iraq/events?fields=name,start_time,end_time,place,description&since=now&access_token=301801280168696|FDzuXZs_Mio_vtBjPvH-fYcBglU')




  var date = Date();

  console.log (

  `************************

  Date is ${date}
  
  ************************`

  );

  // uwindsormsa

  var serviceAccount = require("./service_accounts/uwindsormsa-b5d32-firebase-adminsdk-lpueq-f1492ecaf9.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://uwindsormsa-b5d32.firebaseio.com"
  });


  // wia

  var serviceAccount = require("./service_accounts/wiassociation-9e259-firebase-adminsdk-s9p59-474d67974c.json");

  var wia_config = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wiassociation-9e259.firebaseio.com"
  };

  var wia = admin.initializeApp(wia_config, "wia");

  // noor

  var serviceAccount = require("./service_accounts/anoorschool-4330c-firebase-adminsdk-6fsxt-220743a3e6.json");

  var noor_config = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://anoorschool-4330c.firebaseio.com"
  };

  var noor = admin.initializeApp(noor_config, "noor");

  // wic

  var serviceAccount = require("./service_accounts/nodejs-a3a07-firebase-adminsdk-hx4cb-24e337ad8c.json");

  var node_config = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nodejs-a3a07.firebaseio.com"
  };

  var wic = admin.initializeApp(node_config, "wic");



 
  // wic

  request({
    url: url + '/uwindsormsa/' + param,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200 && body.data.length > 0) {
      
        accessFirebaseDataBase(body, "uwindsormsa");
    
    }
  })

  // noor

  request({
    url: url + '/annoorschool/' + param,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200 && body.data.length > 0) {
      // // Print the json response
      // if (JSON.parse(body).data.length > 0) {
        accessFirebaseDataBase(body, "noor");
      // }
    }
  })

  // windsor

  request({
    url: url + '/windsormosque/' + param,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200 && body.data.length > 0) {
      // // Print the json response
      // if (JSON.parse(body).data.length > 1) {
        accessFirebaseDataBase(body, "wia");
      // }
    }
  })

  //WIC

  request({
    url: url + '/WindsorIslamicC/' + param,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200 && body.data.length > 0) {
      // // Print the json response
      // if (JSON.parse(body).data.length > 0) {
        accessFirebaseDataBase(body, "wic");
      // }
    }
  })

  // accessFirebaseDataBase(res);
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
  function accessFirebaseDataBase(jsonData, fbPage) {

    // console.log("entering switch");
    switch (fbPage) {
      case "uwindsormsa":
        var ref = admin.database();
        console.log("switch uwindsormsa");
        break;
      case "noor":
        var ref = noor.database();
        console.log("switch noor");
        break;
      case "wia":
        var ref = wia.database();
        console.log("switch wia");
        break;
      case "wic":
        var ref = wic.database();
        console.log("switch wic");
        break;
      default:
        console.log("error at switch");
        break;
    }

    // console.log("we passed switch");

    // -- 3 --
    // var jsonWithNoDups = checkForMultipleHost(jsonData)
    //  console.log("now data " + jsonWithNoDups[1].data[0].name);
    // var ref = admin.database().ref("server/events");

    ref.ref("server/events").once("value", function (snapshot) {
      if (snapshot.val() !== null) {

        // -- 4 --
        readFromFirebase(jsonData, ref, fbPage);

      } else {

        // -- 5 --
        noDataExist(jsonData, ref, fbPage)
      }
    });
  }

  // **************************************************************************//
  //  - 3 - check if two pages are hosting similar events and delete 1 from json
  // **************************************************************************//
  // function checkForMultipleHost(jsonData) {
  // // for ()
  //   var m = i + 1
  //   // ******************** //
  //   // reading every page
  //   // ******************** //
  //   for (var i = 0; i < jsonData.length-1; i++){
  //   //  var m = i + 1
  //   // console.log("i is " + i);
  //     console.log(jsonData[i]);
  //
  //     // ************************************************** //
  //     // reading inside of each page (each events)
  //     // ************************************************* //
  //     for (var j = 0; j < jsonData[i].data.length; j++) {
  //       var m = i + 1
  //       // console.log(jsonData[m].data.length);
  //
  //       // ******************** *************************//
  //       // reading event + 1 to comapre with previous
  //       // ******************** *************************//
  //       if (jsonData[m].data.length > 0) {
  //     //  console.log("here");
  //       //console.log(i + " " + j);
  //       // console.log("value is " + jsonData[m].data[j].id);
  //       if (jsonData[i].data[j].id === jsonData[m].data[j].id){
  //       // var m = i+1
  //         // console.log("Found dups at index" + i + " " + j);
  //
  //         // *********************************************************//
  //         // delete the duplicated event from JSON then save to db
  //         // *********************************************************//
  //         delete jsonData[i].data[j];
  //
  //         // console.log("data json is " + jsonData[i].data[j].name);
  //         }
  //       }
  //     }
  //   }
  //   return jsonData
  // }

  // *****************************************************************//
  //  - 4 - Write Data to Database -----------
  // *****************************************************************//
  function readFromFirebase(jsonData, fbRef, fbPage) {
    console.log("Calling readFromFirebase");

    // console.log("jsonData.length " + jsonData.length);
    //console.log("jsonData[i].length " + jsonData[0].length);
    // Loop the JSON values

    // console.log("i is " + i);
    // console.log(jsonData[i].data.length);
    // console.log("jsonData[i].length is " + jsonData[i].length);
    for (var j = 0; j < jsonData.data.length; j++) {

      //   console.log("inside for-loop");
      //   console.log("jsonData.length is " + jsonData[i].data[j]);
      //   console.log("out j is " + j);

      // - 4 - A -
      checkForDupsInsideDB(jsonData, j, jsonData.data[j].id, fbRef, fbPage);
    }
    // console.log("out of loop j");


    // *******************************************************************************//
    //  - 4 - A - if new event dones't have same {id} of event in Database --> save
    // ******************************************************************************//
    function checkForDupsInsideDB(jsonData, j, id, fbRef, fbPage) {

      // console.log("Checking user for id " + id);
      // console.log(i + "/data");
      fbRef.ref("server/events").orderByChild("id").equalTo(id).once("value", function (snapshot) {
        var userData = snapshot.val();
        //console.log("inside index is " + index);
        //console.log("DB value is = " + userData[index].name);
        //console.log("jsonData value is = " + id);
        if (userData) {
          console.log("Page: " + fbPage  + " - checkForDupsInsideDB: Event exist ");

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
           console.log("Page: " + fbPage  + " - checkForDupsInsideDB: Event doesn't exis in DB ");
          
          //  console.log(jsonData.data[0].id);

          // - 4 - B -
          addUnderNameFOrNotifications(jsonData, j, fbRef);
          // - 4 - C -
          //saveToFirebase(jsonData, i,j);

          addNewEvent(jsonData, j, fbRef);
        }
      });
    }
  }

  // *****************************************************************//
  // - 4 - B - This is used to save name in a different node, why ? to use FCM
  // *****************************************************************//
  function addUnderNameFOrNotifications(jsonData, i, fbRef, fbPage) {

    var data = {
      "name": jsonData.data[i].name
    }
    fbRef.ref("/server/name").set(jsonData.data[i].name, function (error) {
      if (error) {
        // console.log("Page: " + fbPage  + " - checkForDupsInsideDB: Event doesn't exis in DB ");
        console.log("Page: " + fbPage  + " - addUnderNameFOrNotifications: Name of event could not be saved." + error);
      } else {
        console.log("Page: " + fbPage  + " - addUnderNameFOrNotifications: Name of event saved SUCCESS.");
        // console.log("addUnderNameFOrNotifications: Name of event saved successfully.");
      }
    })
  }

  function addNewEvent(jsonData, i, fbRef, fbPage) {

    var n = new Date().getMilliseconds(); //so that there is not dups and things get overwritten

    fbRef.ref("server/events").child(jsonData.data[i].start_time + n).set(jsonData.data[i], function (error) {
      if (error) {
        console.log("Page: " + fbPage  + " - addNewEvent: event could not be saved" + error);
      } else {
        console.log("Page: " + fbPage  + " - addNewEvent: event saved successfully");
      }
    })
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
  function noDataExist(jsonData, fbRef) {
    console.log("calling noDataExist function");

    var nameRef = fbRef.ref("server").child("name");
    var eventRef = fbRef.ref("server").child("event");

    for (var i = 0; i < jsonData.data.length; i++) {
      addUnderNameFOrNotifications(jsonData, i, fbRef);
      addNewEvent(jsonData, i, fbRef);
    }
    console.log("leaving noDataExist function");
  }

  console.log("Reached End of app");

  // used to stop the fuking thing

  setTimeout(() => {
    process.exit(0);
  }, 20000)