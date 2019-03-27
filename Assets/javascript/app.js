// Initialize Firebase
var config = {
  apiKey: "AIzaSyBMGbYjveKhLgENYbIZhOxUBp78SgPF5cw",
  authDomain: "traintime-f427b.firebaseapp.com",
  databaseURL: "https://traintime-f427b.firebaseio.com",
  projectId: "traintime-f427b",
  storageBucket: "traintime-f427b.appspot.com",
  messagingSenderId: "1037432634871"
};
firebase.initializeApp(config);

//Reference database
var database = firebase.database();

/*Global Variables
 ==============================================================*/
 var trainName = '';
 var destTrain = '';
 var firstTrainTime = '';
 var freqTrain = '';

 //Conversion Variable
 var firstTimeConverted = '';
 var diffTime = '';
 var tRemainder;
 var tMinutesTillTrain;
 var nextTrain;

 //Data reference
 var trainNameData = '';
 var destData = '';
 var arrivalData = '';
 var freqData = '';
 var minutesAwayData = '';

 /*Functions
 ==============================================================*/
 //When Submit button is clicked.....
 $('#submit').on('click', function (event) {
     event.preventDefault();
     //Get input info
     trainName = $('#trainName').val().trim();
     destTrain = $('#dest').val().trim();
     firstTrainTime = $('#firstTrainTime').val().trim();
     freqTrain = $('#freq').val().trim();

     //Removed input info
     $('#trainName').val('');
     $('#dest').val('');
     $('#firstTrainTime').val('');
     $('#freq').val('');

     //Conversion
     //Convert to HH:MM
     firstTimeConversion = moment(firstTrainTime, "hh:mm").subtract(1, "years");
     //Converts the firsTimeCover object into string

     // Current Time
     var currentTime = moment();
     diffTime = moment().diff(moment(firstTimeConversion), "minutes");

     // Time apart (remainder)
     tRemainder = diffTime % freqTrain;

     // Minute Until Train
     tMinutesTillTrain = freqTrain - tRemainder;

     // Next Train
     nextTrain = moment().add(tMinutesTillTrain, "minutes");
     nextTrainFormat = moment(nextTrain).format('hh:mm');

     database.ref('/trainSchedule').push({
         trainName: trainName,
         destination: destTrain,
         arrival: nextTrainFormat,
         minutesAway: tMinutesTillTrain,
         frequency: freqTrain
     });
 });

 database.ref('/trainSchedule').on('child_added', function (snap) {
     //Testing
     trainNameData = snap.val().trainName;
     destData = snap.val().destination;
     arrivalData = snap.val().arrival;
     freqData = snap.val().frequency;
     minutesAwayData = snap.val().minutesAway;

     //Data array
     var dataArray = [trainNameData, destData, freqData, arrivalData, minutesAwayData];
     var newTr = $('<tr>');
     for (var i = 0; i < dataArray.length; i++) {
         var newTd = $('<td>');
         newTd.text(dataArray[i]);
         newTd.appendTo(newTr);
     }
     $('.table').append(newTr);
  });

 