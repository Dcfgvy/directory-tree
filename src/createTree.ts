import directoryTree = require('directory-tree');

export function build_tree(
  path: string = __dirname,
  options?: any,
  onEachFile?: (item: any, path: string, stats: any) => void,
  onEachDirectory?: (item: any, path: string, stats: any) => void
): any {
  return directoryTree(path, options, onEachFile, onEachDirectory);
}

function multiply_string(str: string, times: number): string {
  let final_string = "";
  for(let i = 0; i < times; i++){
    final_string += str;
  }
  return final_string;
}

// recursive function
function read_object(structure: any, obj: any, indexes: Array<number>, tab: number, hasNext: boolean){
  const depth = indexes.length;
  let final_string = "";

  if(depth === 0) final_string += `${obj.name}\n`;
  else{
    let prepending_string = "";
    let prepending_string_working_array: Array<any> = Array.isArray(structure.children) ? [ ...structure.children ] : [];
    for(let i = 0; i < depth - 1; i++){
      const index: number = indexes[i];
      const working_obj: any = prepending_string_working_array[index];
      if(Array.isArray(working_obj.children)){
        prepending_string += prepending_string_working_array[index + 1] ? '│' : ' ';
        prepending_string += multiply_string(' ', tab + 1);
        prepending_string_working_array = working_obj.children;
      } else break;
    }
    final_string += `${prepending_string}${hasNext ? '├' : '└'}${multiply_string('─', tab)} ${obj.name}\n`;
  }

  if(obj.children && obj.children.length > 0){
    for(let i = 0; i < obj.children.length; i++){
      final_string += read_object(structure, obj.children[i], [...indexes, i], tab, i < obj.children.length - 1);
    }
  }
  return final_string;
}

export function build_scheme(
  path: string = __dirname,
  tabLength: number = 2,
  options?: any,
  onEachFile?: (item: any, path: string, stats: any) => void,
  onEachDirectory?: (item: any, path: string, stats: any) => void,
): string {
  const structure = directoryTree(path, options, onEachFile, onEachDirectory);
  return read_object(structure, structure, [], tabLength, false).trim();
}