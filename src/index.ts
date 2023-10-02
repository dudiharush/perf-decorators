import { perf, logPerf, logParam, Prop } from "./decorator";
import { delay, hasPerfData } from "./utils";

@logPerf
class Users {
  @Prop
  usersGroup = "some group name";

  @perf
  async getUsers() {
    await delay(1000);
    return [];
  }

  @perf
  async getUser(@logParam id: number) {
    await delay(50);
    return {
      id: `user${id}`,
    };
  }
}

(async function () {
  const users = new Users();
  await users.getUser(22);
  await users.getUser(42);
  await users.getUsers();

  console.log(users.usersGroup);
  if (hasPerfData(users)) {
    users.logPref();
  }
})();
