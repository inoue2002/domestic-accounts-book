import { useEffect, useState } from 'react';
import { getUser } from '../useFirestore';

const Members = ({ eventId, eventState }) => {
  // メンバー情報を取得
  console.log(eventState.members);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    (async () => {
      const memberArray = [];
      for (const member of eventState.members) {
        memberArray.push(await getUser(member));
      }
      setMembers(memberArray);
    })();
  }, [eventState.members]);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex justify-start w-full">
          <div className="p-5 font-bold">メンバー</div>
        </div>
        <div className="flex justify-start pl-5">
          {members
            ? members.map((member, index) => (
                <img class="w-10 h-10 rounded-full mr-2" src={member.imageUrl} alt="アイコン" key={index} />
              ))
            : 'ありません'}
        </div>
      </div>
    </>
  );
};

export default Members;
