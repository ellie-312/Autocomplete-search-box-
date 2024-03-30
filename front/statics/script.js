function search(that, event) {
    if (["ArrowDown", "ArrowUp", "Enter"].indexOf(event.key) != -1) {
        keyControl(event)
    } else {
        $('#suggestions').html('');

        var searchValue = $('#searchBox').val();
        if (!searchValue) {
            $('#suggestions').hide();
        } else {
            $.getJSON(`http://127.0.0.1:5000/search/${searchValue}`, function (data) {

                $(data).each(function (index) {
                    $('#suggestions').append("<li>" + data[index] + "</li>");
                });

                $('#suggestions').show();
                $('#suggestions').find("li").show();
            });
        }
    }
}

function keyControl(e) {
    var container = $(".bar");

    if (e.key == "ArrowDown") {

        if (container.find("ul li").hasClass("selected")) {
            if (container.find("ul li:visible").index(container.find("ul li.selected")) + 1 < container.find("ul li:visible").length) {
                container.find("ul li.selected").removeClass("selected").nextAll().first().addClass("selected");
            }

        } else {
            container.find("ul li:first-child").addClass("selected");
        }

    } else if (e.key == "ArrowUp") {
        if (container.find("ul li:visible").index(container.find("ul li.selected")) > 0) {
            container.find("ul li.selected").removeClass("selected").prevAll().first().addClass("selected");
        }
    } else if (e.key == "Enter") {
        container.find("input").val(container.find("ul li.selected").text()).blur();
        $('#suggestions').html('');
        $('#searchBox').closest(".bar").find("ul").hide();
        $("#searchBox").focus()
    }
}

$(document).on('click', '.bar ul li', function () {
    var container = $(".bar");
    container.find("input").val($(this).text()).blur();
    $('#suggestions').html('');
    $('#searchBox').closest(".bar").find("ul").hide();
    $("#searchBox").focus()
});

$(".bar ul li").hover(function () {
    $(this).closest(".bar").find("ul li.selected").removeClass("selected");
    $(this).addClass("selected");
});