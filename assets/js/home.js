function initMap() {
    // The location of Uluru
    var uluru = {lat: -25.344, lng: 131.036};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: uluru});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: uluru, map: map});
  }
  
  $(document).ready(function(){
    var date_input=$('input[name="date"]'); //our date input has the name "date"
    var date_input2=$('input[name="date2"]');
    var container=$('.bootstrap-iso .form1').length>0 ? $('.bootstrap-iso .form1').parent() : "body";
    var options={
      format: 'mm/dd/yyyy',
      container: container,
      todayHighlight: true,
      autoclose: true,
      orientation: 'bottom right'
      };
    date_input.datepicker(options);
    date_input2.datepicker(options);
  
    $("#submitBtn").click(function(){
      console.log(($('#myselect1').val()));
      console.log(($('#myselect2').val()));
      console.log(($('#myselect3').val()));
      console.log(($('#myselect4').val()));
      console.log(($('#myselect5').val()));
      // console.log(($('#myselect6').val()));
      console.log(($('#date2').val()));
      console.log(($('#date').val()));
      });
  
  });