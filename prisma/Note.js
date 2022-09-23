import prisma from "./prisma";


// 
// note specific calls
// 

export const createNote = async (title, body, session) => {
	const newNote = await prisma.note.create({
		data: {
			title,
			body,
			user: {
				connect: {
					email: session?.user?.email
				}
			},
			group: {
				connectOrCreate: {
					where: {
						default: session?.user?.id,
					},
					create: {
						name: 'Notes',
						color: '#FFFFFF',
						default: session?.user?.id,
						user: {
							connect: {
								email: session?.user?.email
							}
						},
					},
				},
			},
		},
	});

	const note = await getNoteByID(newNote.id);
	return note;
};

export const getNoteByID = async (id) => {
	const note = await prisma.note.findUnique({
		where: {
			id
		},
		include: {
			user: true,
			group: true
		}
	});

	return JSON.parse(JSON.stringify(note));
};

export const updateNote = async (id, updatedData, session) => {
	let userId = session?.user.id;
	const updatedNote = await prisma.note.update({
		where: {
			id_userId: {
				id,
				userId
			}
		},
		data: {
			...updatedData,
		}
	});
	const note = await getNoteByID(updatedNote.id);
	return note;
};


export const deleteNote = async (id, session) => {
	let userId = session?.user.id;
	const deletedNote = await prisma.note.delete({
		where: {
			id_userId: {
				id,
				userId
			}
		}
	});
	return deletedNote;
};


// 
// multi-note specific calls
// 

export const getAllNotesByUserID = async (id) => {
	const notes = await prisma.user.findMany({
		where: {
			id: id
		},
		select: {
			groups: {
				include: {
					notes: {
						include: {
							group: true
						}
					}
				}
			}
		}
	});
	return JSON.parse(JSON.stringify(notes));
};

// 
// user specific calls
// 

export const changeProfilePicture = async (session) => {

};


// 
// group specific calls
// 

export const createGroup = async (title, session) => {
	const newGroup = await prisma.group.create({
		data: {
			title,
			user: {
				connect: {
					email: session?.user?.email
				}
			}
		},
	});
	const group = await getNoteByID(newGroup.id);
	return group;
};

export const updateGroup = async (id, updatedData, session) => {
	let userId = session?.user.id;
	const updatedGroup = await prisma.group.update({
		where: {
			id_userId: {
				id,
				userId
			}
		},
		data: {
			...updatedData,
		}
	});
	const group = await getNoteByID(updatedGroup.id);
	return group;
};

export const deleteGroup = async (id, session) => {
	let userId = session?.user.id;
	const deletedGroup = await prisma.group.delete({
		where: {
			id_userId: {
				id,
				userId
			}
		}
	});
	return deletedGroup;
};
