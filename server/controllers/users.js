import User from '../models/User.js';

/* READ */
export const getUser = async (req, res) => {
  try {
    // Ambil id yang ada di parameter
    const { id } = req.params;
    //   Lalu cari user berdasarkan id nya
    const user = await User.findById(id);
    //   Kemudian Tampilkan
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    // Ambil id yang ada di parameter
    const { id } = req.params;
    //   Lalu cari user berdasarkan id nya
    const user = await User.findById(id);
    // Membuat multiple API calls (memanggil beberapa API di database)
    const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
    //   Ambil beberapa informasi yang dibutuhkan dari friend data
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });
    //   Tampilkan di Frontend
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    //   Cek apakan user saat ini include friendId dari friends (dimodel user)
    if (user.friends.includes(friendId)) {
      // Kita akan buat array yang ada di friends user hanya akan memiliki daftar friends yang tidak termasuk friendId saat ini, jadi otomatis meremove friendId dari array Friends pada User
      user.friends = user.friends.filter((id) => id !== friendId);
      // Meremove daftar kita dari array teman kita juga, jadi ketika kita me remove dia dari daftar teman kita, otomatis daftar kita di list pertemanan dia juga ikut terhapus
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // Jika tidak include friendId tersebut maka kita tambahkan di daftar friends kita dan juga teman kita
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    // Lalu simpan
    await user.save();
    await friend.save();

    const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
