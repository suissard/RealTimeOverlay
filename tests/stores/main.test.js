import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMainStore } from '../../src/stores/main'
import { createPinia, setActivePinia } from 'pinia'
import { io } from 'socket.io-client'

// Mock socket.io-client
const emit = vi.fn()
const on = vi.fn()
const socket = {
  on,
  emit,
  id: 'mock-socket-id',
}
vi.mock('socket.io-client', () => {
  return {
    io: vi.fn(() => socket),
  }
})

describe('Pinia Store: main', () => {
  beforeEach(() => {
    // We need to reset mocks before each test
    vi.clearAllMocks()
    setActivePinia(createPinia())
  });

  it('should have correct initial state', () => {
    const store = useMainStore()
    expect(store.roomId).toBe(null)
    expect(store.isConnected).toBe(false)
    expect(store.isRemote).toBe(false)
    expect(store.message).toBe(null)
    expect(store.socket).toBe(null)
    expect(store.room).toBe(null)
    expect(store.error).toBe(null)
  })

  it('generateRoomId should generate a room id in the correct format', () => {
    const store = useMainStore()
    store.generateRoomId()
    expect(typeof store.roomId).toBe('string')
    expect(store.roomId.length).toBe(19)
    expect(store.roomId.split('-').length).toBe(4)
  })

  it('connect action should initialize socket and emit join', () => {
    const store = useMainStore()
    const roomId = 'test-room'
    store.connect(roomId, true)

    expect(io).toHaveBeenCalledWith('http://localhost:3000')
    expect(store.socket).not.toBe(null)

    // Simulate the 'connect' event
    const connectCallback = on.mock.calls.find(call => call[0] === 'connect')[1]
    connectCallback()

    expect(store.isConnected).toBe(true) // because isRemote is true
    expect(emit).toHaveBeenCalledWith('join', { roomId, isRemote: true })
  })

  it('sendMessage action should emit control_message', () => {
    const store = useMainStore()
    store.socket = socket; // mock socket
    store.roomId = 'test-room';

    store.sendMessage('hello')

    expect(emit).toHaveBeenCalledWith('control_message', { room: 'test-room', message: { type: 'text', content: 'hello' }})
  })

  it('manageSlots action should emit manage_slots', () => {
    const store = useMainStore()
    store.socket = socket; // mock socket
    store.roomId = 'test-room';

    store.manageSlots('add')

    expect(emit).toHaveBeenCalledWith('manage_slots', { roomId: 'test-room', action: 'add'})
  })

  it('should update state on room_joined event', () => {
    const store = useMainStore()
    store.connect('test-room', false)

    const roomData = { users: [{id: 'user1'}], capacity: 2 };
    const roomJoinedCallback = on.mock.calls.find(call => call[0] === 'room_joined')[1]
    roomJoinedCallback(roomData)

    expect(store.isConnected).toBe(true)
    expect(store.room).toEqual(roomData)
  })

  it('should update state on control_message event', () => {
    const store = useMainStore()
    store.connect('test-room', false)

    const message = 'new message';
    const controlMessageCallback = on.mock.calls.find(call => call[0] === 'control_message')[1]
    controlMessageCallback(message)

    expect(store.message).toBe(message)
  })
})
