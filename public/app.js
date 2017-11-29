$(document).on("click", "button", function(e) {
  // Empty the notes from the note section
  e.preventDefault();
  console.log('sweet');
  // Save the id from the p tag
  var thisId = $(this).siblings('textarea').attr("data-id");
  console.log(thisId);
  console.log($(this).siblings('textarea').val())

  $.post('/article/' + thisId, 
  	{
  		comment: $(this).siblings('textarea').val()
  	})
    // With that done, add the note information to the page
    .done(function(data) {
			console.log('Comment Submitted');
      // location.reload();
    });

  $(this).siblings('textarea').val(' ');
});
