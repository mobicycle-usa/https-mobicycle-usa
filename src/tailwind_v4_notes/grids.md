grid-auto-columns

Utilities for controlling the size of implicitly-created grid columns.
Class
	Styles
auto-cols-auto
	
grid-auto-columns: auto;
auto-cols-min
	
grid-auto-columns: min-content;
auto-cols-max
	
grid-auto-columns: max-content;
auto-cols-fr
	
grid-auto-columns: minmax(0, 1fr);
auto-cols-(<custom-property>)
	
grid-auto-columns: var(<custom-property>);
auto-cols-[<value>]
	
grid-auto-columns: <value>;

grid-template-columns

Utilities for specifying the columns in a grid layout.
Class
	Styles
grid-cols-<number>
	
grid-template-columns: repeat(<number>, minmax(0, 1fr));
grid-cols-none
	
grid-template-columns: none;
grid-cols-subgrid
	
grid-template-columns: subgrid;
grid-cols-[<value>]
	
grid-template-columns: <value>;
grid-cols-(<custom-property>)
	
grid-template-columns: var(<custom-property>);

grid-column

Utilities for controlling how elements are sized and placed across grid columns.
Class
	Styles
col-span-<number>
	
grid-column: span <number> / span <number>;
col-span-full
	
grid-column: 1 / -1;
col-span-(<custom-property>)
	
grid-column: span var(<custom-property>) / span var(<custom-property>);
col-span-[<value>]
	
grid-column: span <value> / span <value>;
col-start-<number>
	
grid-column-start: <number>;
-col-start-<number>
	
grid-column-start: calc(<number> * -1);
col-start-auto
	
grid-column-start: auto;
col-start-(<custom-property>)
	
grid-column-start: var(<custom-property>);
col-start-[<value>]
	
grid-column-start: <value>;
col-end-<number>
	
grid-column-end: <number>;
-col-end-<number>
	
grid-column-end: calc(<number> * -1);
col-end-auto
	
grid-column-end: auto;
col-end-(<custom-property>)
	
grid-column-end: var(<custom-property>);
col-end-[<value>]
	
grid-column-end: <value>;
col-auto
	
grid-column: auto;
col-<number>
	
grid-column: <number>;
-col-<number>
	
grid-column: calc(<number> * -1);
col-(<custom-property>)
	
grid-column: var(<custom-property>);
col-[<value>]
	
grid-column: <value>;

he issue was that Tailwind CSS v4 wasn't scanning your TypeScript files to find the grid classes you were using.

  Your grid code was always correct (grid-cols-*, col-span-*), but without the --content flag in the build command, Tailwind didn't know where to look for classes, so it wasn't generating the CSS for them.

  Fix: Added --content './src/**/*.{js,ts,html}' to the build script in package.json to tell Tailwind v4 where to scan for classes.