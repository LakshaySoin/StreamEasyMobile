class Node:
    def __init__(self, val=None, prev=None, next=None):
        self.val = val
        self.prev = prev
        self.next = next
    
class DLList:
    def __init__(self):
        self.first = Node()
        self.first.next = self.first
        self.first.prev = self.first
        self.curr = self.first
        self.size = 0

    def addNode(self, temp, node):
        # add node before curr
        node.prev = temp.prev
        node.next = temp
        temp.prev.next = node
        temp.prev = node
        self.size += 1

    def insert(self, index, val):
        assert (index >= 0 and index <= self.size)
        num = 0
        temp = self.first
        while num != index:
            temp = temp.next
            num += 1
        node = Node(val)
        self.addNode(temp, node)

    def removeNode(self, temp):
        temp.prev.next = temp.next
        temp.next.prev = temp.prev
        self.size -= 1

    def remove(self, val):
        if (self.size == 0):
            return
        temp = self.first.next
        found = False
        while temp != self.first:
            if (temp.val == val):
                found = True
                break
            temp = temp.next
        if (found):
            self.removeNode(temp)

    def addLast(self, val):
        node = Node(val)
        self.addNode(self.first, node)

    def getNext(self):
        self.curr = self.curr.next
        if (self.curr == self.first):
            self.curr = self.curr.next
        val = self.curr.val
        return val

    def getPrev(self):
        self.curr = self.curr.prev
        if (self.curr == self.first):
            self.curr = self.curr.prev
        val = self.curr.val
        return val

    def isEmpty(self):
        return self.size == 0

    def clear(self):
        self.first.next = self.first
        self.first.prev = self.first
        self.curr = self.first
        self.size = 0
    
    def __iter__(self):
        temp = self.curr.next
        while temp != self.first:
            yield temp.val
            temp = temp.next