const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');
const lines = content.split('\n');

// 1. Let's fix lines 2280-2283 (indices 2280, 2281, 2282)
console.log('Replacing lines 2280-2282:');
console.log('  Was:', lines[2280], '&&', lines[2281], '&&', lines[2282]);
lines[2280] = '                            )}';
lines[2281] = '                          </div>';
lines[2282] = '                        </div>';

// 2. Let's find the closing area of the assignment page.
// The toggle button ends at:
//                       <span className="text-[10px] text-emerald-400">◀</span>
//                     </button>
//
//                   </div>
//                 )}
//
// We want to change the ending `</div>\n                )}` to `</div>\n                </div>\n              )}`
// Let's locate this sequence in the file.
const fullContent = lines.join('\n');
const targetEndSeq = `                      <span className="text-[10px] text-emerald-400">◀</span>
                    </button>

                  </div>
                )}`;

const replacementEndSeq = `                      <span className="text-[10px] text-emerald-400">◀</span>
                    </button>

                  </div>
                </div>
              )}`;

if (fullContent.includes(targetEndSeq)) {
  console.log('Found target ending sequence!');
  const newContent = fullContent.replace(targetEndSeq, replacementEndSeq);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Saved TravellersDesk.tsx successfully!');
} else {
  console.error('Could not find target ending sequence!');
}
