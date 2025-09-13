"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderHomePage = renderHomePage;
var layout_1 = require("../layouts/layout");
var Header_1 = require("../components/Header");
var SectionOne_1 = require("../components/SectionOne");
var SectionTwo_1 = require("../components/SectionTwo");
var SectionThree_1 = require("../components/SectionThree");
var SectionFour_1 = require("../components/SectionFour");
var Footer_1 = require("../components/Footer");
var ParallaxBackground_1 = require("../components/ParallaxBackground");
function renderHomePage() {
    var content = "\n    ".concat((0, ParallaxBackground_1.renderParallaxBackground)(), "\n    \n    <!-- HEADER -->\n    <div class=\"md:bg-slate-900 bg-gradient-to-b from-transparent to-purple-650\"></div>\n    \n    <!-- CONTENT -->\n    <div class=\"space-y-20 lg:space-y-40 mt-20 container mx-auto\">\n      ").concat(renderTitle(), "\n      <div class=\"flex justify px-8\">").concat((0, SectionOne_1.renderSectionOne)(), "</div>\n      <div class=\"flex justify px-8\">").concat((0, SectionTwo_1.renderSectionTwo)(), "</div>\n      <div class=\"flex justify px-8\">").concat((0, SectionThree_1.renderSectionThree)(), "</div>\n      <div class=\"flex justify px-8\">").concat((0, SectionFour_1.renderSectionFour)(), "</div>\n    </div>\n    \n    <!-- FOOTER -->\n    <div class=\"space-y-0 pt-20\">\n      <div class=\"px-8 pb-10 dark:bg-gradient-to-br dark:from-slate-950 bg-gradient-to-br from-yellow-650 md:bg-gradient-to-b md:from-slate-950 border-t rounded-lg z-50\">\n        ").concat((0, Footer_1.renderFooter)(), "\n      </div>\n    </div>\n  ");
    return (0, layout_1.renderLayout)('MobiCycle USA | Home', content);
}
function renderTitle() {
    return "\n    <div class=\"space-y-20\">\n      <!-- MOBILE -->\n      <div class=\"flex md:hidden container mx-auto px-4 pt-20 lg:pt-32 pb-24 bg-gradient-to-l from-yellow-650 border-transparent rounded-lg dark:bg-transparent-650 dark:from-transparent-650\">\n        <div class=\"flex md:w-full ml-36 md:justify-start z-0\">\n          ".concat((0, Header_1.renderHeader)(), "\n        </div>\n      </div>\n\n      <!-- DESKTOP -->\n      <div class=\"hidden md:flex container mx-auto px-4 pt-10 pb-20 bg-gradient-to-l from-slate-900 to-100% via-slate-700 via-55% border-transparent rounded-xl\">\n        <div class=\"flex md:w-full ml-36 z-0\">\n          ").concat((0, Header_1.renderHeader)(), "\n        </div>\n      </div>\n    </div>\n  ");
}
