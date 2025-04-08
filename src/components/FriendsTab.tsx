import React, { useState } from "react";

interface FriendsTabProps {
  friendsData: any[];
  pendingRequests: any[];
  onNavigate: (path: string) => void;
  onSendFriendRequest: (friendUsername: string) => Promise<void>;
  onAcceptFriendRequest: (friendshipId: string) => Promise<void>;
}

const FriendsTab: React.FC<FriendsTabProps> = ({
  friendsData,
  pendingRequests,
  onNavigate,
  onSendFriendRequest,
  onAcceptFriendRequest,
}) => {
  const [friendUsername, setFriendUsername] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl mb-2">Друзья:</h2>
      <div className="mb-4">
        <input
          type="text"
          value={friendUsername}
          onChange={(e) => setFriendUsername(e.target.value)}
          placeholder="Введите имя пользователя"
          className="p-2 rounded bg-gray-800 text-white w-full mb-2"
        />
        <button
          onClick={() => onSendFriendRequest(friendUsername)}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Отправить запрос
        </button>
      </div>

      <h3 className="text-lg">Друзья:</h3>
      {friendsData.length > 0 ? (
        <ul className="space-y-2">
          {friendsData.map((friend) => (
            <li key={friend._id} className="flex items-center gap-2">
              <img
                src={friend.avatar || "https://i.ibb.co.com/Zyn02g6/avatar-default.webp"}
                alt={friend.username || "Без имени"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span
                onClick={() => onNavigate(`/profile/${friend.username}`)}
                className="cursor-pointer hover:underline"
              >
                {friend.username || "Без имени"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>У вас пока нет друзей</p>
      )}

      <h3 className="text-lg mt-4">Ожидающие запросы:</h3>
      {pendingRequests.length > 0 ? (
        <ul className="space-y-2">
          {pendingRequests.map((request) => (
            <li key={request._id} className="flex items-center gap-2">
              <img
                src={request.userId.avatar || "https://i.ibb.co.com/Zyn02g6/avatar-default.webp"}
                alt={request.userId.username || "Без имени"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span>{request.userId.username || "Без имени"}</span>
              <button
                onClick={() => onAcceptFriendRequest(request._id)}
                className="bg-green-500 px-2 py-1 rounded hover:bg-green-600"
              >
                Принять
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет ожидающих запросов</p>
      )}
    </div>
  );
};

export default FriendsTab;