
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
