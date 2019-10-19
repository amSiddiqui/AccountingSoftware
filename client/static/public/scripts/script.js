
// Make a checkbox checked by clicking anywhere on a row

$(document).ready(function() {
    $('.records tr').click(function(event) {
        if (event.target.type !== 'checkbox') {
            $(':checkbox', this).trigger('click');
        }
    });
});

// configuring selectAll checkbox

$('#selectAll').click(function(e){
    var table= $(e.target).closest('table');
    $('td input:checkbox',table).prop('checked',this.checked);
});

//hover effect

$(document).ready(function(){
  $("article.has-background-white").hover(function(){
    $(this).addClass("has-background-white-bis");
    $(this).removeClass("has-background-white");

    }, function(){
      $(this).removeClass("has-background-white-bis");
      $(this).addClass("has-background-white");
  });
});

$('li.tab').click(function(e){
  $('li.tab').removeClass("is-active");
  $(this).addClass("is-active");
});
