package com.example.project1

import jupiterpi.cranberri.runtime.api.*

val MY_CONSTANT = 42

fun mySharedMethod() {
    IO.writePin(1, IO.PinValue.HIGH)
}