import type { frontendclient } from "./types";

// Sort members by how good their name matches the input (search function)
export function sortMembers(searchString: string, members: frontendclient[]): frontendclient[] {
  return members.sort((a,b) => {
    // A's score, B's score
    let as = 0, bs = 0;

    // These parameters can be changed to whatever, found these work fine for me
    let usernameweight = 2;
    let displaynameweight = 1;

    // Check if the displaynames include the search string
    if (a.displayname.includes(searchString)) as += displaynameweight;
    if (b.displayname.includes(searchString)) bs += displaynameweight;

    // Check if the usernames include the search string
    if (a.username.includes(searchString)) as += usernameweight;
    if (b.username.includes(searchString)) bs += usernameweight;
    
    // Check if the displaynames start with the search string
    if (a.displayname.startsWith(searchString)) as += displaynameweight;
    if (b.displayname.startsWith(searchString)) bs += displaynameweight;

    // Check if the usernames start with the search string
    if (a.username.startsWith(searchString)) as += usernameweight;
    if (b.username.startsWith(searchString)) bs += usernameweight;

    // Return them so the one with the highest score comes first
    return bs - as;
  });
}
