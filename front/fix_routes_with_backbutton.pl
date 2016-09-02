#!/usr/bin/perl
open(input1,"$ARGV[0]");
while(<input1>){
   $file = $file.$_; 
}
close input1;
$back_button_view_1 = "\n\t\t\'backbutton\@";
$back_button_view_2 = "\'\:\{\n\t\ttemplateUrl\: \'shared_html\/backbutton.html\'\n\t\t\}";
$back_button_view_3 = ",\n\t\t\'not_backbutton\@";
$back_button_view_4 = "\'\:\{\n\t\ttemplateUrl\: \'shared_html\/not_backbutton.html\'\n\t\t\}";

$file=~ s/\n/CARRIAGERETURN/g;
$file=~ s/(\'@\'\: \{.+?)(controller\: \')(.+?)(\'.+?\})/$1$2$3$4\,${back_button_view_1}$3${back_button_view_2}${back_button_view_3}$3${back_button_view_4}/mg;
$file=~ s/CARRIAGERETURN/\n/g;
open(output1,">$ARGV[0]");
print output1 $file;
close output1;

