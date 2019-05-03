/**
 * Created by Administrator on 2018/1/23.
 */
$(document).ready(function () {
    var height=$(window).height();
    var width=$(window).width();
    $("#main").css("height",parseInt(height)-90+"px").css("width",parseInt(width)-200+"px");
});
$(window).resize(function() {
    var height=$(window).height();
    var width=$(window).width();
    $(".side-scroll").css("height",parseInt(height)-90+"px");
    $("#main").css("height",parseInt(height)-90+"px").css("width",parseInt(width)-200+"px");
});
$(".toggle-collapse").click(function () {
    var width=$(window).width();
    if($(this).hasClass("toggle-show")){
        $(this).removeClass("toggle-show").animate({left:'200px'});
        $("#main").css("width",parseInt(width)-200+"px").animate({left:'200px'});
        // $("#navMenu").css("left","0");
        $("#navMenu").animate({left:'0px'}).fadeIn("slow");
    }else{
        $(this).addClass("toggle-show").animate({left:'0px'});
        $("#main").css("width",parseInt(width)+"px").animate({left:'0px'});
        // $("#navMenu").css("left","-200px");
        $("#navMenu").animate({left:'-200px'});
    }

});